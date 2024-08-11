package oauth

import (
	"context"
	"errors"
	"reflect"
	"sync"
	"time"

	desuengine "github.com/mahmudindes/orenolink-desuengine"
	"github.com/mahmudindes/orenolink-desuengine/internal/model"
)

type cTokenCacheStore interface {
	GetAccessToken(ctx context.Context, id string) (*accessToken, error)
	SetAccessToken(ctx context.Context, id string, t *accessToken) error
	GetIDToken(ctx context.Context, id string) (*idToken, error)
	SetIDToken(ctx context.Context, id string, t *idToken) error
}

func newCTokenCache(rdb Redis) cTokenCacheStore {
	if rdb != nil && !reflect.ValueOf(rdb).IsNil() {
		return cTokenCacheRedis{rdb}
	}
	memory := &cTokenCacheMemory{
		accessTokens: make(map[string]accessToken),
		idTokens:     make(map[string]idToken),
	}
	go memory.BackgroundPurger()
	return memory
}

type cTokenCacheMemory struct {
	accessTokens map[string]accessToken
	idTokens     map[string]idToken
	mu           sync.Mutex
}

func (ctcm *cTokenCacheMemory) GetAccessToken(ctx context.Context, id string) (*accessToken, error) {
	ctcm.mu.Lock()
	defer ctcm.mu.Unlock()

	val, ok := ctcm.accessTokens[id]
	if !ok || time.Until(val.Expiration)/2 <= 0 {
		delete(ctcm.accessTokens, id)
		return nil, nil
	}
	return &val, nil
}

func (ctcm *cTokenCacheMemory) SetAccessToken(ctx context.Context, id string, t *accessToken) error {
	ctcm.mu.Lock()
	defer ctcm.mu.Unlock()

	if t != nil {
		ctcm.accessTokens[id] = *t
	}
	return nil
}

func (ctcm *cTokenCacheMemory) GetIDToken(ctx context.Context, id string) (*idToken, error) {
	ctcm.mu.Lock()
	defer ctcm.mu.Unlock()

	val, ok := ctcm.idTokens[id]
	if !ok || time.Until(val.Expiration)/2 <= 0 {
		delete(ctcm.idTokens, id)
		return nil, nil
	}
	return &val, nil
}

func (ctcm *cTokenCacheMemory) SetIDToken(ctx context.Context, id string, t *idToken) error {
	ctcm.mu.Lock()
	defer ctcm.mu.Unlock()

	if t != nil {
		ctcm.idTokens[id] = *t
	}
	return nil
}

func (ctcm *cTokenCacheMemory) BackgroundPurger() {
	d0 := 5 * time.Minute
	d1 := 1 * time.Hour
	go func() {
		d := d0
		for {
			ctcm.mu.Lock()
			for key, val := range ctcm.accessTokens {
				exp := time.Until(val.Expiration) / 2
				if d < exp {
					switch {
					case exp < d0:
						d = d0
					case exp > d1:
						d = d1
					default:
						d = exp
					}
				}
				if exp <= 0 {
					delete(ctcm.accessTokens, key)
				}
			}
			ctcm.mu.Unlock()
			time.Sleep(d)
		}
	}()
	go func() {
		d := d0
		for {
			ctcm.mu.Lock()
			for key, val := range ctcm.idTokens {
				exp := time.Until(val.Expiration) / 2
				if d < exp {
					switch {
					case exp < d0:
						d = d0
					case exp > d1:
						d = d1
					default:
						d = exp
					}
				}
				if exp <= 0 {
					delete(ctcm.idTokens, key)
				}
			}
			ctcm.mu.Unlock()
			time.Sleep(d)
		}
	}()
}

type cTokenCacheRedis struct {
	rdb Redis
}

var (
	cTokenCacheRedisPrefix0 = desuengine.ID + ":oauth:access-token:"
	cTokenCacheRedisPrefix1 = desuengine.ID + ":oauth:id-token:"
)

func (ctcr cTokenCacheRedis) GetAccessToken(ctx context.Context, id string) (*accessToken, error) {
	var token *accessToken
	if err := ctcr.rdb.GobGet(ctx, cTokenCacheRedisPrefix0+id, token); err != nil {
		if errors.As(err, &model.ErrNotFound) {
			return nil, nil
		}
		return nil, model.CacheError(err)
	}
	return token, nil
}

func (ctcr cTokenCacheRedis) SetAccessToken(ctx context.Context, id string, t *accessToken) error {
	expiry := time.Until(t.Expiration) / 2
	if expiry <= 0 {
		return nil
	}
	if err := ctcr.rdb.GobSet(ctx, cTokenCacheRedisPrefix0+id, t, expiry); err != nil {
		return model.CacheError(err)
	}
	return nil
}

func (ctcr cTokenCacheRedis) GetIDToken(ctx context.Context, id string) (*idToken, error) {
	var token *idToken
	if err := ctcr.rdb.GobGet(ctx, cTokenCacheRedisPrefix1+id, token); err != nil {
		if errors.As(err, &model.ErrNotFound) {
			return nil, nil
		}
		return nil, model.CacheError(err)
	}
	return token, nil
}

func (ctcr cTokenCacheRedis) SetIDToken(ctx context.Context, id string, t *idToken) error {
	expiry := time.Until(t.Expiration) / 2
	if expiry <= 0 {
		return nil
	}
	if err := ctcr.rdb.GobSet(ctx, cTokenCacheRedisPrefix1+id, t, expiry); err != nil {
		return model.CacheError(err)
	}
	return nil
}

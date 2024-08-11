package oauth

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/lestrrat-go/jwx/v2/jwk"

	"github.com/mahmudindes/orenolink-desuengine/internal/logger"
)

type (
	OAuth struct {
		issuer      string
		clientID    string
		audience    string
		jwks        jwk.Set
		cTokenCache cTokenCacheStore
		logger      logger.Logger
	}

	Config struct {
		Issuer           string `conf:"issuer"`
		ClientID         string `conf:"client_id"`
		Audience         string `conf:"audience"`
		PermissionPrefix string `conf:"permission_prefix"`
	}

	Redis interface {
		GobGet(ctx context.Context, key string, v any) error
		GobSet(ctx context.Context, key string, v any, exp time.Duration) error
	}
)

func New(ctx context.Context, rdb Redis, cfg Config, log logger.Logger) (*OAuth, error) {
	data := struct {
		Issuer  string `json:"issuer"`
		JWKSURI string `json:"jwks_uri"`
	}{}

	client := &http.Client{Timeout: 15 * time.Second}

	oauthMetadata := cfg.Issuer + ".well-known/oauth-authorization-server"
	reqOM, err := http.NewRequestWithContext(ctx, http.MethodGet, oauthMetadata, nil)
	if err != nil {
		return nil, err
	}
	resOM, err := client.Do(reqOM)
	if err != nil {
		return nil, err
	}
	defer resOM.Body.Close()

	if resOM.StatusCode < 400 {
		if err := json.NewDecoder(resOM.Body).Decode(&data); err != nil {
			return nil, err
		}
	}

	if resOM.StatusCode >= 400 {
		oidcDiscovery := cfg.Issuer + ".well-known/openid-configuration"
		reqOD, err := http.NewRequestWithContext(ctx, http.MethodGet, oidcDiscovery, nil)
		if err != nil {
			return nil, err
		}
		resOD, err := client.Do(reqOD)
		if err != nil {
			return nil, err
		}
		defer resOD.Body.Close()

		if err := json.NewDecoder(resOD.Body).Decode(&data); err != nil {
			return nil, err
		}
	}

	if data.Issuer != cfg.Issuer {
		return nil, fmt.Errorf("issuer did not match, expected %q got %q", cfg.Issuer, data.Issuer)
	}

	jwkc := jwk.NewCache(ctx)
	if err := jwkc.Register(data.JWKSURI, jwk.WithHTTPClient(client)); err != nil {
		return nil, err
	}

	jwks, err := jwkc.Refresh(ctx, data.JWKSURI)
	if err != nil {
		return nil, err
	}

	return &OAuth{
		issuer:      cfg.Issuer,
		clientID:    cfg.ClientID,
		audience:    cfg.Audience,
		jwks:        jwks,
		cTokenCache: newCTokenCache(rdb),
		logger:      log,
	}, nil
}

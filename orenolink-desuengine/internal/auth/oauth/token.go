package oauth

import (
	"context"
	"slices"
	"strings"
	"time"

	"github.com/lestrrat-go/jwx/v2/jwt"

	"github.com/mahmudindes/orenolink-desuengine/internal/model"
)

type accessToken struct {
	Subject    string
	Expiration time.Time
	Others     map[string]any
}

func (at accessToken) Claim(name string) (any, bool) {
	switch name {
	case jwt.SubjectKey:
		return at.Subject, true
	case jwt.ExpirationKey:
		return at.Expiration, true
	default:
		v, ok := at.Others[name]
		return v, ok
	}
}

func (at accessToken) HasScope(scope string) bool {
	if s0, ok := at.Claim("scope"); ok {
		s1, _ := s0.(string)
		return slices.Contains(strings.Split(s1, " "), scope)
	}
	return false
}

func (at accessToken) HasPermission(permission string) bool {
	if p0, ok := at.Claim("permissions"); ok {
		switch p1 := p0.(type) {
		case []any: // Auth0 RBAC
			for _, p2 := range p1 {
				if p3, _ := p2.(string); p3 == permission {
					return true
				}
			}
		case string:
			return slices.Contains(strings.Split(p1, " "), permission)
		}
	}
	return false
}

func (oa OAuth) parseAccessToken(ctx context.Context, token string) (*accessToken, error) {
	cache, err := oa.cTokenCache.GetAccessToken(ctx, token)
	switch {
	case err != nil:
		oa.logger.ErrMessage(err, "Parse access token get cache failed.")
	case cache != nil:
		return cache, nil
	}
	jwtParseOpts := []jwt.ParseOption{
		jwt.WithContext(ctx),
		jwt.WithKeySet(oa.jwks),
		jwt.WithIssuer(oa.issuer),
	}
	if oa.audience != "" {
		jwtParseOpts = append(jwtParseOpts, jwt.WithAudience(oa.audience))
	}
	result0, err := jwt.ParseString(token, jwtParseOpts...)
	if err != nil {
		switch {
		case oa.IsTokenExpiredError(err):
			return nil, model.WrappedError(err, "expired access token")
		case oa.IsTokenValidationError(err):
			return nil, model.WrappedError(err, "invalid access token")
		}
		return nil, err
	}
	result := &accessToken{
		Subject:    result0.Subject(),
		Expiration: result0.Expiration(),
		Others:     result0.PrivateClaims(),
	}
	go func() {
		if err := oa.cTokenCache.SetAccessToken(context.Background(), token, result); err != nil {
			oa.logger.ErrMessage(err, "Parse access token set cache failed.")
		}
	}()
	return result, nil
}

type idToken struct {
	Subject       string
	Expiration    time.Time
	Nonce         string
	EmailVerified bool
	Others        map[string]any
}

func (idt idToken) Claim(name string) (any, bool) {
	switch name {
	case jwt.SubjectKey:
		return idt.Subject, true
	default:
		v, ok := idt.Others[name]
		return v, ok
	}
}

func (oa OAuth) parseIDToken(ctx context.Context, token string) (*idToken, error) {
	cache, err := oa.cTokenCache.GetIDToken(ctx, token)
	switch {
	case err != nil:
		oa.logger.ErrMessage(err, "Parse id token get cache failed.")
	case cache != nil:
		return cache, nil
	}
	jwtParseOpts := []jwt.ParseOption{
		jwt.WithContext(ctx),
		jwt.WithKeySet(oa.jwks),
		jwt.WithIssuer(oa.issuer),
	}
	if oa.clientID != "" {
		jwtParseOpts = append(jwtParseOpts, jwt.WithAudience(oa.clientID))
	}
	result0, err := jwt.ParseString(token, jwtParseOpts...)
	if err != nil {
		switch {
		case oa.IsTokenExpiredError(err):
			return nil, model.WrappedError(err, "expired id token")
		case oa.IsTokenValidationError(err):
			return nil, model.WrappedError(err, "invalid id token")
		}
		return nil, err
	}
	nonce := ""
	if nonceToken, ok := result0.Get("nonce"); ok {
		nonce, _ = nonceToken.(string)
	}
	emailVerified := false
	if emailVerifiedToken, ok := result0.Get("email_verified"); ok {
		emailVerified, _ = emailVerifiedToken.(bool)
	}
	result := &idToken{
		Subject:       result0.Subject(),
		Expiration:    result0.Expiration(),
		Nonce:         nonce,
		EmailVerified: emailVerified,
		Others:        result0.PrivateClaims(),
	}
	go func() {
		if err := oa.cTokenCache.SetIDToken(context.Background(), token, result); err != nil {
			oa.logger.ErrMessage(err, "Parse id token set cache failed.")
		}
	}()
	return result, nil
}

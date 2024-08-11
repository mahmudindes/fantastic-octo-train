package oauth

import (
	"context"
	"errors"

	"github.com/lestrrat-go/jwx/v2/jwt"

	"github.com/mahmudindes/orenolink-desuengine/internal/model"
)

func (oa OAuth) IsTokenValidationError(err error) bool {
	return jwt.IsValidationError(err)
}

func (oa OAuth) IsTokenExpiredError(err error) bool {
	return errors.Is(err, jwt.ErrTokenExpired())
}

func (oa OAuth) ProcessIDToken(ctx context.Context, token, nonce string) (string, error) {
	result, err := oa.parseIDToken(ctx, token)
	switch {
	case err != nil:
		return "", err
	case result != nil:
		if !result.EmailVerified {
			return "", model.GenericError("email is not verified")
		}
		if result.Nonce != nonce {
			return "", model.GenericError("incorrect id token nonce")
		}
		return result.Subject, nil
	}
	return "", nil
}

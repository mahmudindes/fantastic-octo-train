package oauth

import "context"

type (
	ctxAccessToken    struct{}
	ctxAccessTokenRaw struct{}
)

func (oa OAuth) ContextAccessToken(ctx context.Context, token string) context.Context {
	ctx = context.WithValue(ctx, ctxAccessToken{}, new(accessToken))
	ctx = context.WithValue(ctx, ctxAccessTokenRaw{}, token)
	return ctx
}

func (oa OAuth) ProcessTokenContext(ctx context.Context) (bool, error) {
	if token, ok := ctx.Value(ctxAccessTokenRaw{}).(string); ok {
		result, err := oa.parseAccessToken(ctx, token)
		switch {
		case err != nil:
			return false, err
		case result != nil:
			if t, ok := ctx.Value(ctxAccessToken{}).(*accessToken); ok && t != nil {
				*t = *result
				return true, nil
			}
		}
	}
	return false, nil
}

func (oa OAuth) SubjectContext(ctx context.Context) string {
	if t, ok := ctx.Value(ctxAccessToken{}).(*accessToken); ok && t != nil {
		return t.Subject
	}
	return ""
}

func (oa OAuth) HasPermissionContext(ctx context.Context, permission string) bool {
	if t, ok := ctx.Value(ctxAccessToken{}).(*accessToken); ok && t != nil {
		return t.HasPermission(permission)
	}
	return false
}

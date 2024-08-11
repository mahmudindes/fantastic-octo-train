package service

import (
	"context"

	"github.com/mahmudindes/orenolink-desuengine/internal/model"
)

type (
	Service struct {
		database database
		oauth    oauth
	}

	database interface {
		AddUser(
			ctx context.Context,
			data model.AddUser, v *model.User,
		) error
		GetUserByUsername(
			ctx context.Context,
			username string,
		) (*model.User, error)
		GetUserByAuthSubject(
			ctx context.Context,
			authSubject string,
		) (*model.User, error)
		UpdateUserByUsername(
			ctx context.Context,
			username string,
			data model.SetUser, v *model.User,
		) error
		DeleteUserByUsername(
			ctx context.Context,
			username string,
			v *model.User,
		) error
		ListUser(
			ctx context.Context,
			params model.ParamUsers,
		) ([]*model.User, error)
		CountUser(
			ctx context.Context,
			params model.ParamUsers,
		) (int, error)

		AddLink(
			ctx context.Context,
			data model.AddLink, v *model.Link,
		) error
		GetLinkByCode(
			ctx context.Context,
			code string,
		) (*model.Link, error)
		UpdateLinkByCode(
			ctx context.Context,
			code string,
			data model.SetLink, v *model.Link,
		) error
		DeleteLinkByCode(
			ctx context.Context,
			code string,
			v *model.Link,
		) error
		ListLink(
			ctx context.Context,
			params model.ParamLinks,
		) ([]*model.Link, error)
		CountLink(
			ctx context.Context,
			params model.ParamLinks,
		) (int, error)
	}

	oauth interface {
		SubjectContext(ctx context.Context) string
		HasPermissionContext(ctx context.Context, permission string) bool
		ProcessIDToken(ctx context.Context, token, nonce string) (string, error)
	}
)

func New(db database, oa oauth) Service {
	return Service{database: db, oauth: oa}
}

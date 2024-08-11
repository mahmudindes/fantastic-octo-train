package rapi

import (
	"context"

	"github.com/mahmudindes/orenolink-desuengine/internal/logger"
	"github.com/mahmudindes/orenolink-desuengine/internal/model"
)

type (
	api struct {
		service Service
		oauth   OAuth
		logger  logger.Logger
	}

	Service interface {
		AddUser(
			ctx context.Context,
			data model.AddUser, v *model.User,
		) error
		GetUserByUsername(
			ctx context.Context,
			username string,
		) (*model.User, error)
		UpdateUserByUsername(
			ctx context.Context,
			username string,
			data model.SetUser, v *model.User,
		) error
		DeleteUserByUsername(
			ctx context.Context,
			username string,
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
			password *string,
		) (*model.Link, error)
		UpdateLinkByCode(
			ctx context.Context,
			code string,
			data model.SetLink, v *model.Link,
		) error
		DeleteLinkByCode(
			ctx context.Context,
			code string,
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

	OAuth interface {
		ProcessTokenContext(ctx context.Context) (bool, error)
		SubjectContext(ctx context.Context) string
		IsTokenExpiredError(err error) bool
	}
)

const SecuritySchemeBearerAuth = "BearerAuth"

var _ ServerInterface = (*api)(nil)

func NewAPI(svc Service, oa OAuth, log logger.Logger) *api {
	return &api{service: svc, oauth: oa, logger: log}
}

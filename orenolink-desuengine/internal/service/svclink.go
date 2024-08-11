package service

import (
	"context"

	"golang.org/x/crypto/bcrypt"

	"github.com/mahmudindes/orenolink-desuengine/internal/model"
)

func (svc Service) AddLink(
	ctx context.Context,
	data model.AddLink, v *model.Link,
) error {
	writePermission := svc.oauth.HasPermissionContext(ctx, model.PermissionWrite)
	authSubject := svc.oauth.SubjectContext(ctx)
	switch {
	case !writePermission && authSubject != "":
		user, err := svc.GetUserByAuthSubject(ctx, authSubject)
		switch {
		case err != nil:
			return err
		case user != nil:
			data.UserID = &user.ID
			data.UserUsername = nil
		default:
			return model.GenericError("user does not exist")
		}
	case !writePermission:
		return model.GenericError("missing permission to add link")
	}

	if err := data.Validate(); err != nil {
		return err
	}

	if data.Password != nil {
		password := []byte(*data.Password)

		hashBytes, err := bcrypt.GenerateFromPassword(password, bcrypt.DefaultCost)
		if err != nil {
			return err
		}

		hash := string(hashBytes)
		data.PasswordHash = &hash
	}

	return svc.AddLink(ctx, data, v)
}

func (svc Service) GetLinkByCode(
	ctx context.Context,
	code string,
	password *string,
) (*model.Link, error) {
	result, err := svc.database.GetLinkByCode(ctx, code)
	if err != nil {
		return nil, err
	}

	passwordMatch := false
	if result.PasswordHash != nil && password != nil {
		passwordMatch = bcrypt.CompareHashAndPassword(
			[]byte(*result.PasswordHash),
			[]byte(*password),
		) != nil
	}

	readPermission := svc.oauth.HasPermissionContext(ctx, model.PermissionRead)
	if !readPermission && result.PasswordHash != nil && !passwordMatch {
		result.Rules = nil
		result.Targets = nil
		result.Result = nil
	}

	return result, nil
}

func (svc Service) UpdateLinkByCode(
	ctx context.Context,
	code string,
	data model.SetLink, v *model.Link,
) error {
	writePermission := svc.oauth.HasPermissionContext(ctx, model.PermissionWrite)
	authSubject := svc.oauth.SubjectContext(ctx)
	switch {
	case !writePermission && authSubject != "":
		user, err := svc.GetUserByAuthSubject(ctx, authSubject)
		switch {
		case err != nil:
			return err
		case user == nil:
			return model.GenericError("user does not exist")
		}

		link, err := svc.database.GetLinkByCode(ctx, code)
		switch {
		case err != nil:
			return err
		case link != nil:
			if link.UserID == nil || *link.UserID != user.ID {
				return model.GenericError("forbidden to update link")
			}
		}
	case !writePermission:
		return model.GenericError("missing permission to update link")
	}

	if err := data.Validate(); err != nil {
		return err
	}

	if data.Password != nil {
		password := []byte(*data.Password)

		hashBytes, err := bcrypt.GenerateFromPassword(password, bcrypt.DefaultCost)
		if err != nil {
			return err
		}

		hash := string(hashBytes)
		data.PasswordHash = &hash
	}

	if err := svc.database.UpdateLinkByCode(ctx, code, data, v); err != nil {
		return err
	}

	return nil
}

func (svc Service) DeleteLinkByCode(
	ctx context.Context,
	code string,
) error {
	writePermission := svc.oauth.HasPermissionContext(ctx, model.PermissionWrite)
	authSubject := svc.oauth.SubjectContext(ctx)
	switch {
	case !writePermission && authSubject != "":
		user, err := svc.GetUserByAuthSubject(ctx, authSubject)
		switch {
		case err != nil:
			return err
		case user == nil:
			return model.GenericError("user does not exist")
		}

		link, err := svc.database.GetLinkByCode(ctx, code)
		switch {
		case err != nil:
			return err
		case link != nil:
			if link.UserID == nil || *link.UserID != user.ID {
				return model.GenericError("forbidden to delete link")
			}
		}
	case !writePermission:
		return model.GenericError("missing permission to delete link")
	}

	return svc.database.DeleteLinkByCode(ctx, code, nil)
}

func (svc Service) ListLink(
	ctx context.Context,
	params model.ParamLinks,
) ([]*model.Link, error) {
	if err := params.Validate(); err != nil {
		return nil, err
	}

	if len(params.OrderBys) > model.LinkOrderBysMax {
		return nil, model.GenericError("too many link order by param")
	}
	if pagination := params.Pagination; pagination != nil {
		if pagination.Limit > model.LinkPaginationMax {
			pagination.Limit = model.LinkPaginationMax
		}
	}

	result, err := svc.database.ListLink(ctx, params)
	if err != nil {
		return nil, err
	}

	readPermission := svc.oauth.HasPermissionContext(ctx, model.PermissionRead)
	var user *model.User
	if authSubject := svc.oauth.SubjectContext(ctx); authSubject != "" {
		user, err = svc.GetUserByAuthSubject(ctx, authSubject)
		switch {
		case err != nil:
			return nil, err
		case user == nil:
			return nil, model.GenericError("user does not exist")
		}
	}
	for _, r := range result {
		if !readPermission && r.PasswordHash != nil {
			if r.UserID == nil || user == nil || *r.UserID != user.ID {
				r.Rules = nil
				r.Targets = nil
				r.Result = nil
			}
		}
	}

	return result, nil
}

func (svc Service) CountLink(
	ctx context.Context,
	params model.ParamLinks,
) (int, error) {
	return svc.database.CountLink(ctx, params)
}

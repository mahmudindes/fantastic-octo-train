package service

import (
	"context"

	"github.com/mahmudindes/orenolink-desuengine/internal/model"
	"github.com/mahmudindes/orenolink-desuengine/internal/utila"
)

func (svc Service) AddUser(
	ctx context.Context,
	data model.AddUser, v *model.User,
) error {
	if data.AuthIDToken == nil {
		if !svc.oauth.HasPermissionContext(ctx, model.PermissionWrite) {
			return model.GenericError("missing permission to add user")
		}
	}

	if err := data.Validate(); err != nil {
		return err
	}

	if data.AuthIDToken != nil {
		nonce := ""
		if data.AuthIDTokenNonce != nil {
			nonce = *data.AuthIDTokenNonce
		}

		authSubject, err := svc.oauth.ProcessIDToken(ctx, *data.AuthIDToken, nonce)
		if err != nil {
			return err
		}

		data.AuthSubject = &authSubject
	}

	if err := svc.database.AddUser(ctx, data, v); err != nil {
		return err
	}

	if v != nil {
		if !svc.oauth.HasPermissionContext(ctx, model.PermissionRead) {
			if v.AuthSubject == nil || *v.AuthSubject != svc.oauth.SubjectContext(ctx) {
				v.AuthSubject = &model.SecretString
			}
		}
	}

	return nil
}

func (svc Service) GetUserByUsername(
	ctx context.Context,
	username string,
) (*model.User, error) {
	result, err := svc.database.GetUserByUsername(ctx, username)
	if err != nil {
		return nil, err
	}

	if !svc.oauth.HasPermissionContext(ctx, model.PermissionRead) {
		if result.AuthSubject == nil || *result.AuthSubject != svc.oauth.SubjectContext(ctx) {
			result.AuthSubject = &model.SecretString
		}
	}

	return result, nil
}

func (svc Service) GetUserByAuthSubject(
	ctx context.Context,
	authSubject string,
) (*model.User, error) {
	result, err := svc.database.GetUserByAuthSubject(ctx, authSubject)
	if err != nil {
		return nil, err
	}

	if !svc.oauth.HasPermissionContext(ctx, model.PermissionRead) {
		if result.AuthSubject == nil || *result.AuthSubject != svc.oauth.SubjectContext(ctx) {
			result.AuthSubject = &model.SecretString
		}
	}

	return result, nil
}

func (svc Service) UpdateUserByUsername(
	ctx context.Context,
	username string,
	data model.SetUser, v *model.User,
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
			if user.AuthSubject == nil || *user.AuthSubject != authSubject {
				return model.GenericError("forbidden to update user")
			}
		}

		data.AuthSubject = nil
		utila.SlicesDelete(data.SetNull, "auth_subject")
	case !writePermission:
		return model.GenericError("missing permission to update user")
	}

	if err := data.Validate(); err != nil {
		return err
	}

	if err := svc.database.UpdateUserByUsername(ctx, username, data, v); err != nil {
		return err
	}

	if v != nil {
		if !svc.oauth.HasPermissionContext(ctx, model.PermissionRead) {
			if v.AuthSubject == nil || *v.AuthSubject != authSubject {
				v.AuthSubject = &model.SecretString
			}
		}
	}

	return nil
}

func (svc Service) DeleteUserByUsername(
	ctx context.Context,
	username string,
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
			if user.AuthSubject == nil || *user.AuthSubject != authSubject {
				return model.GenericError("forbidden to delete user")
			}
		}
	case !writePermission:
		return model.GenericError("missing permission to delete user")
	}

	return svc.database.DeleteUserByUsername(ctx, username, nil)
}

func (svc Service) ListUser(
	ctx context.Context,
	params model.ParamUsers,
) ([]*model.User, error) {
	if err := params.Validate(); err != nil {
		return nil, err
	}

	if len(params.OrderBys) > model.UserOrderBysMax {
		return nil, model.GenericError("too many user order by param")
	}
	if pagination := params.Pagination; pagination != nil {
		if pagination.Limit > model.UserPaginationMax {
			pagination.Limit = model.UserPaginationMax
		}
	}

	result, err := svc.database.ListUser(ctx, params)
	if err != nil {
		return nil, err
	}

	readPermission := svc.oauth.HasPermissionContext(ctx, model.PermissionRead)
	authSubject := svc.oauth.SubjectContext(ctx)
	for _, r := range result {
		if !readPermission {
			if r.AuthSubject == nil || *r.AuthSubject != authSubject {
				r.AuthSubject = &model.SecretString
			}
		}
	}

	return result, nil
}

func (svc Service) CountUser(
	ctx context.Context,
	params model.ParamUsers,
) (int, error) {
	return svc.database.CountUser(ctx, params)
}

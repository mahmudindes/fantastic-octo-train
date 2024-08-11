package database

import (
	"context"
	"errors"
	"slices"
	"time"

	desuengine "github.com/mahmudindes/orenolink-desuengine"
	"github.com/mahmudindes/orenolink-desuengine/internal/model"
)

const (
	TableUser             = desuengine.ID + ".user"
	ColumnUserUsername    = "username"
	ColumnUserAuthSubject = "auth_subject"
	NameErrUserKey0       = "user_username_key"
	NameErrUserKey1       = "user_auth_subject_key"
)

var (
	SetNullAllowUser = []string{
		ColumnUserAuthSubject,
	}

	OrderByAllowUser = []string{
		ColumnGenericID,
		ColumnGenericCreatedAt,
		ColumnGenericUpdatedAt,
		ColumnUserUsername,
		ColumnUserAuthSubject,
	}
)

func (db Database) AddUser(
	ctx context.Context,
	data model.AddUser, v *model.User,
) error {
	cols, vals, args := SetInsert(map[string]any{
		ColumnUserUsername:    data.Username,
		ColumnUserAuthSubject: data.AuthSubject,
	})
	sql := "INSERT INTO " + TableUser + " (" + cols + ") VALUES (" + vals + ")"
	if v != nil {
		sql += " RETURNING *"
		if err := db.QueryOne(ctx, v, sql, args...); err != nil {
			return userSetError(err)
		}
	} else {
		if err := db.Exec(ctx, sql, args...); err != nil {
			return userSetError(err)
		}
	}
	return nil
}

func (db Database) getUser(
	ctx context.Context,
	conds any,
) (*model.User, error) {
	args := []any{}
	cond := SetCondition(conds, &args)
	sql := "SELECT * FROM " + TableUser + " WHERE " + cond
	var result model.User
	if err := db.QueryOne(ctx, &result, sql, args...); err != nil {
		return nil, err
	}
	return &result, nil
}

func (db Database) GetUserByUsername(
	ctx context.Context,
	username string,
) (*model.User, error) {
	return db.getUser(ctx, SQLHelperKV{
		Key:   ColumnUserUsername,
		Value: SQLInsensitiveLike(username),
	})
}

func (db Database) GetUserByAuthSubject(
	ctx context.Context,
	authSubject string,
) (*model.User, error) {
	return db.getUser(ctx, SQLHelperKV{
		Key:   ColumnUserAuthSubject,
		Value: authSubject,
	})
}

func (db Database) updateUser(
	ctx context.Context,
	conds any,
	data model.SetUser, v *model.User,
) error {
	data0 := map[string]any{}
	if data.Username != nil {
		data0[ColumnUserUsername] = data.Username
	}
	if data.AuthSubject != nil {
		data0[ColumnUserAuthSubject] = data.AuthSubject
	}
	for _, key := range data.SetNull {
		if !slices.Contains(SetNullAllowUser, key) {
			return model.GenericError("set null " + key + " is not recognized")
		}
		data0[key] = nil
	}
	data0[ColumnGenericUpdatedAt] = time.Now().UTC()
	sets, args := SetUpdate(data0)
	cond := SetCondition(SQLAnd{conds, SetUpdateCondition(data0)}, &args)
	sql := "UPDATE " + TableUser + " SET " + sets + " WHERE " + cond
	if v != nil {
		sql += " RETURNING *"
		if err := db.QueryOne(ctx, v, sql, args...); err != nil {
			return userSetError(err)
		}
	} else {
		if err := db.Exec(ctx, sql, args...); err != nil {
			return userSetError(err)
		}
	}
	return nil
}

func (db Database) UpdateUserByUsername(
	ctx context.Context,
	username string,
	data model.SetUser, v *model.User,
) error {
	return db.updateUser(ctx, SQLHelperKV{
		Key:   ColumnUserUsername,
		Value: SQLInsensitiveLike(username),
	}, data, v)
}

func (db Database) deleteUser(
	ctx context.Context,
	conds any,
	v *model.User,
) error {
	args := []any{}
	cond := SetCondition(conds, &args)
	sql := "DELETE FROM " + TableUser + " WHERE " + cond
	if v != nil {
		sql += " RETURNING *"
		if err := db.QueryOne(ctx, v, sql, args...); err != nil {
			return err
		}
	} else {
		if err := db.Exec(ctx, sql, args...); err != nil {
			return err
		}
	}
	return nil
}

func (db Database) DeleteUserByUsername(
	ctx context.Context,
	username string,
	v *model.User,
) error {
	return db.deleteUser(ctx, SQLHelperKV{
		Key:   ColumnUserUsername,
		Value: SQLInsensitiveLike(username),
	}, v)
}

func (db Database) ListUser(
	ctx context.Context,
	params model.ParamUsers,
) ([]*model.User, error) {
	args := []any{}
	sql := "SELECT * FROM " + TableUser
	cndp := SQLAnd{}
	if len(params.Usernames) > 0 {
		cndp = append(cndp, SQLHelperKV{
			Key:   ColumnUserUsername,
			Value: SQLAnyInsensitiveLike(params.Usernames),
		})
	}
	if cond := SetCondition(cndp, &args); cond != "" {
		sql += " WHERE " + cond
	}
	if len(params.OrderBys) < 1 {
		params.OrderBys = append(params.OrderBys, model.OrderBy{Name: ColumnUserUsername})
	} else {
		for _, ob := range params.OrderBys {
			if !slices.Contains(OrderByAllowUser, ob.Name) {
				return nil, model.GenericError("order by " + ob.Name + "is not recognized")
			}
		}
	}
	sql += " ORDER BY " + SetOrderBys(params.OrderBys, &args)
	if params.Pagination == nil {
		params.Pagination = &model.Pagination{Page: 1, Limit: model.UserPaginationDef}
	}
	if lmof := SetPagination(*params.Pagination, &args); lmof != "" {
		sql += lmof
	}
	result := make([]*model.User, 0)
	if err := db.QueryAll(ctx, &result, sql, args...); err != nil {
		return nil, err
	}
	return result, nil
}

func (db Database) CountUser(
	ctx context.Context,
	params model.ParamUsers,
) (int, error) {
	args := []any{}
	sql := "SELECT COUNT(*) FROM " + TableUser
	cndp := SQLAnd{}
	if len(params.Usernames) > 0 {
		cndp = append(cndp, SQLHelperKV{
			Key:   ColumnUserUsername,
			Value: SQLAnyInsensitiveLike(params.Usernames),
		})
	}
	if cond := SetCondition(cndp, &args); cond != "" {
		sql += " WHERE " + cond
	}
	var dst int
	if err := db.QueryOne(ctx, &dst, sql, args...); err != nil {
		return -1, err
	}
	return dst, nil
}

func userSetError(err error) error {
	var errDatabase model.DatabaseError
	if errors.As(err, &errDatabase) {
		if errDatabase.Code == CodeErrExists {
			switch errDatabase.Name {
			case NameErrUserKey0:
				return model.GenericError("same username already exists")
			case NameErrUserKey1:
				return model.GenericError("same auth subject already exists")
			}
		}
	}
	return err
}

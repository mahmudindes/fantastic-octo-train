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
	TableLink              = desuengine.ID + ".link"
	ColumnLinkCode         = "code"
	ColumnLinkPasswordHash = "password_hash"
	ColumnLinkUserID       = "user_id"
	NameErrLinkKey         = "link_code_key"
	NameErrLinkFKey        = "link_user_id_fkey"
)

var (
	SetNullAllowLink = []string{
		ColumnLinkPasswordHash,
		ColumnLinkUserID,
	}

	OrderByAllowLink = []string{
		ColumnGenericID,
		ColumnGenericCreatedAt,
		ColumnGenericUpdatedAt,
		ColumnLinkCode,
		ColumnLinkUserID,
	}
)

func (db Database) AddLink(
	ctx context.Context,
	data model.AddLink, v *model.Link,
) error {
	var userID any
	switch {
	case data.UserID != nil:
		userID = data.UserID
	case data.UserUsername != nil:
		userID = SQLHelperQV{
			Table:      TableUser,
			Expression: ColumnGenericID,
			ZeroValue:  0,
			Conditions: SQLHelperKV{
				Key:   ColumnUserUsername,
				Value: SQLInsensitiveLike(*data.UserUsername),
			},
		}
	}
	cols, vals, args := SetInsert(map[string]any{
		ColumnLinkCode:         data.Code,
		ColumnLinkPasswordHash: data.PasswordHash,
		ColumnLinkUserID:       userID,
	})
	sql := "INSERT INTO " + TableLink + " (" + cols + ") VALUES (" + vals + ")"
	if v != nil {
		sql += " RETURNING *"
		sql = "WITH data AS (" + sql + ")"
		sql += " SELECT a." + ColumnGenericID
		sql += ", a." + ColumnGenericCreatedAt + ", a." + ColumnGenericUpdatedAt
		sql += ", a." + ColumnLinkCode + ", a." + ColumnLinkPasswordHash
		sql += ", a." + ColumnLinkUserID
		sql += ", b." + ColumnUserUsername + " AS user_username"
		sql += " FROM data a JOIN " + TableUser + " b"
		sql += " ON a." + ColumnLinkUserID + " = b." + ColumnGenericID
		if err := db.QueryOne(ctx, v, sql, args...); err != nil {
			return linkSetError(err)
		}
	} else {
		if err := db.Exec(ctx, sql, args...); err != nil {
			return linkSetError(err)
		}
	}
	return nil
}

func (db Database) getLink(
	ctx context.Context,
	conds any,
) (*model.Link, error) {
	args := []any{}
	cond := SetCondition(conds, &args)
	sql := "SELECT * FROM ("
	sql += "SELECT a." + ColumnGenericID
	sql += ", a." + ColumnGenericCreatedAt + ", a." + ColumnGenericUpdatedAt
	sql += ", a." + ColumnLinkCode + ", a." + ColumnLinkPasswordHash
	sql += ", a." + ColumnLinkUserID
	sql += ", b." + ColumnUserUsername + " AS user_username"
	sql += " FROM " + TableLink + " a JOIN " + TableUser + " b"
	sql += " ON a." + ColumnLinkUserID + " = b." + ColumnGenericID
	sql += ") WHERE " + cond
	var result model.Link
	if err := db.QueryOne(ctx, &result, sql, args...); err != nil {
		return nil, err
	}
	return &result, nil
}

func (db Database) GetLinkByCode(
	ctx context.Context,
	code string,
) (*model.Link, error) {
	return db.getLink(ctx, SQLHelperKV{
		Key:   ColumnLinkCode,
		Value: code,
	})
}

func (db Database) updateLink(
	ctx context.Context,
	conds any,
	data model.SetLink, v *model.Link,
) error {
	data0 := map[string]any{}
	if data.Code != nil {
		data0[ColumnLinkCode] = data.Code
	}
	if data.PasswordHash != nil {
		data0[ColumnLinkPasswordHash] = data.PasswordHash
	}
	switch {
	case data.UserID != nil:
		data0[ColumnLinkUserID] = data.UserID
	case data.UserUsername != nil:
		data0[ColumnLinkUserID] = SQLHelperQV{
			Table:      TableUser,
			Expression: ColumnGenericID,
			ZeroValue:  0,
			Conditions: SQLHelperKV{
				Key:   ColumnUserUsername,
				Value: SQLInsensitiveLike(*data.UserUsername),
			},
		}
	}
	for _, key := range data.SetNull {
		if !slices.Contains(SetNullAllowLink, key) {
			return model.GenericError("set null " + key + " is not recognized")
		}
		data0[key] = nil
	}
	data0[ColumnGenericUpdatedAt] = time.Now().UTC()
	sets, args := SetUpdate(data0)
	cond := SetCondition(SQLAnd{conds, SetUpdateCondition(data0)}, &args)
	sql := "UPDATE " + TableLink + " SET " + sets + " WHERE " + cond
	if v != nil {
		sql += " RETURNING *"
		sql = "WITH data AS (" + sql + ")"
		sql += " SELECT a." + ColumnGenericID
		sql += ", a." + ColumnGenericCreatedAt + ", a." + ColumnGenericUpdatedAt
		sql += ", a." + ColumnLinkCode + ", a." + ColumnLinkPasswordHash
		sql += ", a." + ColumnLinkUserID
		sql += ", b." + ColumnUserUsername + " AS user_username"
		sql += " FROM data a JOIN " + TableUser + " b"
		sql += " ON a." + ColumnLinkUserID + " = b." + ColumnGenericID
		if err := db.QueryOne(ctx, v, sql, args...); err != nil {
			return linkSetError(err)
		}
	} else {
		if err := db.Exec(ctx, sql, args...); err != nil {
			return linkSetError(err)
		}
	}
	return nil
}

func (db Database) UpdateLinkByCode(
	ctx context.Context,
	code string,
	data model.SetLink, v *model.Link,
) error {
	return db.updateLink(ctx, SQLHelperKV{
		Key:   ColumnLinkCode,
		Value: code,
	}, data, v)
}

func (db Database) deleteLink(
	ctx context.Context,
	conds any,
	v *model.Link,
) error {
	args := []any{}
	cond := SetCondition(conds, &args)
	sql := "DELETE FROM " + TableLink + " WHERE " + cond
	if v != nil {
		sql += " RETURNING *"
		sql = "WITH data AS (" + sql + ")"
		sql += " SELECT a." + ColumnGenericID
		sql += ", a." + ColumnGenericCreatedAt + ", a." + ColumnGenericUpdatedAt
		sql += ", a." + ColumnLinkCode + ", a." + ColumnLinkPasswordHash
		sql += ", a." + ColumnLinkUserID
		sql += ", b." + ColumnUserUsername + " AS user_username"
		sql += " FROM data a JOIN " + TableUser + " b"
		sql += " ON a." + ColumnLinkUserID + " = b." + ColumnGenericID
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

func (db Database) DeleteLinkByCode(
	ctx context.Context,
	code string,
	v *model.Link,
) error {
	return db.deleteLink(ctx, SQLHelperKV{
		Key:   ColumnLinkCode,
		Value: code,
	}, v)
}

func (db Database) ListLink(
	ctx context.Context,
	params model.ParamLinks,
) ([]*model.Link, error) {
	args := []any{}
	sql := "SELECT * FROM ("
	sql += "SELECT a." + ColumnGenericID
	sql += ", a." + ColumnGenericCreatedAt + ", a." + ColumnGenericUpdatedAt
	sql += ", a." + ColumnLinkCode + ", a." + ColumnLinkPasswordHash
	sql += ", a." + ColumnLinkUserID
	sql += ", b." + ColumnUserUsername + " AS user_username"
	sql += " FROM " + TableLink + " a JOIN " + TableUser + " b"
	sql += " ON a." + ColumnLinkUserID + " = b." + ColumnGenericID
	sql += ")"
	cndp := SQLAnd{}
	if len(params.Codes) > 0 {
		cvs := make([]any, len(params.Codes))
		for _, v := range params.Codes {
			cvs = append(cvs, v)
		}
		cndp = append(cndp, SQLHelperKV{
			Key:   ColumnLinkCode,
			Value: SQLIn(cvs),
		})
	}
	if len(params.UserUsernames) > 0 {
		cndp = append(cndp, SQLHelperKV{
			Key:   "user_username",
			Value: SQLAnyInsensitiveLike(params.UserUsernames),
		})
	}
	if cond := SetCondition(cndp, &args); cond != "" {
		sql += " WHERE " + cond
	}
	if len(params.OrderBys) < 1 {
		params.OrderBys = append(params.OrderBys, model.OrderBy{Name: ColumnLinkCode})
	} else {
		for _, ob := range params.OrderBys {
			if !slices.Contains(OrderByAllowLink, ob.Name) {
				return nil, model.GenericError("order by " + ob.Name + "is not recognized")
			}
		}
	}
	sql += " ORDER BY " + SetOrderBys(params.OrderBys, &args)
	if params.Pagination == nil {
		params.Pagination = &model.Pagination{Page: 1, Limit: model.LinkPaginationDef}
	}
	if lmof := SetPagination(*params.Pagination, &args); lmof != "" {
		sql += lmof
	}
	result := make([]*model.Link, 0)
	if err := db.QueryAll(ctx, &result, sql, args...); err != nil {
		return nil, err
	}
	return result, nil
}

func (db Database) CountLink(
	ctx context.Context,
	params model.ParamLinks,
) (int, error) {
	args := []any{}
	sql := "SELECT COUNT(*) FROM " + TableLink
	cndp := SQLAnd{}
	if len(params.Codes) > 0 {
		cvs := make([]any, len(params.Codes))
		for _, v := range params.Codes {
			cvs = append(cvs, v)
		}
		cndp = append(cndp, SQLHelperKV{
			Key:   ColumnLinkCode,
			Value: SQLIn(cvs),
		})
	}
	if len(params.UserUsernames) > 0 {
		cndp = append(cndp, SQLHelperKV{
			Key:   "user_username",
			Value: SQLAnyInsensitiveLike(params.UserUsernames),
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

func linkSetError(err error) error {
	var errDatabase model.DatabaseError
	if errors.As(err, &errDatabase) {
		if errDatabase.Code == CodeErrExists && errDatabase.Name == NameErrLinkFKey {
			return model.GenericError("user does not exist")
		}
		if errDatabase.Code == CodeErrExists && errDatabase.Name == NameErrLinkKey {
			return model.GenericError("same code already exists")
		}
	}
	return err
}

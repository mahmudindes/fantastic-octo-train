package database

import (
	"strconv"
	"strings"

	"github.com/mahmudindes/orenolink-desuengine/internal/model"
	"github.com/mahmudindes/orenolink-desuengine/internal/utila"
)

type (
	SQLAnd                []any
	SQLOr                 []any
	SQLNot                struct{ Value any }
	SQLParenthesis        struct{ Value any }
	SQLIsNull             struct{}
	SQLLike               string
	SQLIn                 []any
	SQLFunctionLower      string
	SQLFunctionUpper      string
	SQLIsDistinctFrom     struct{ Value any }
	SQLInsensitiveLike    string
	SQLAnyLike            []string
	SQLAnyInsensitiveLike []string

	SQLHelperKV struct {
		Key   string
		Value any
	}
	SQLHelperQV struct {
		Expression, Table     string
		ZeroValue, Conditions any
	}
)

func SetValue(val any, args *[]any) string {
	switch v := val.(type) {
	case SQLFunctionLower:
		*args = append(*args, string(v))
		return "lower($" + strconv.Itoa(len(*args)) + ")"
	case SQLFunctionUpper:
		*args = append(*args, string(v))
		return "upper($" + strconv.Itoa(len(*args)) + ")"
	case SQLHelperQV:
		cond := SetCondition(v.Conditions, args)
		*args = append(*args, v.ZeroValue)
		subs := "SELECT " + v.Expression + " FROM " + v.Table + " WHERE " + cond
		return "(SELECT COALESCE((" + subs + "), $" + strconv.Itoa(len(*args)) + "))"
	default:
		*args = append(*args, v)
		return "$" + strconv.Itoa(len(*args))
	}
}

func SetInsert(data map[string]any) (cols string, vals string, args []any) {
	for key, val := range data {
		if utila.NilData(val) {
			continue
		}
		length := len(args)
		if length > 0 {
			cols += ", "
			vals += ", "
		}
		cols += key
		vals += SetValue(val, &args)
	}
	return
}

func SetUpdate(data map[string]any) (sets string, args []any) {
	for key, val := range data {
		if sets != "" {
			sets += ", "
		}
		if val == nil {
			sets += key + " = NULL"
			continue
		}
		sets += key + " = " + SetValue(val, &args)
	}
	return
}

func SetUpdateCondition(data map[string]any) (cond map[string]any) {
	cond = make(map[string]any)
	for key, val := range data {
		if utila.NilData(val) {
			cond[key] = SQLNot{Value: SQLIsNull{}}
			continue
		}
		cond[key] = SQLNot{Value: SQLIsDistinctFrom{Value: val}}
	}
	return
}

func SetCondition(cndp any, args *[]any) (cond string) {
	cndp, cnot := cndp, false
	if v, ok := cndp.(SQLNot); ok {
		cndp = v.Value
		cnot = true
	}
	switch conds := cndp.(type) {
	case map[string]any:
		for key, val := range conds {
			if utila.NilData(val) {
				continue
			}
			conx := SetCondition(SQLHelperKV{Key: key, Value: val}, args)
			if conx == "" {
				continue
			}
			if cond != "" {
				cond += " AND "
			}
			cond += conx
		}
		if cond != "" && cnot {
			cond = "NOT (" + cond + ")"
		}
	case SQLAnd:
		for _, conds := range conds {
			conx := SetCondition(conds, args)
			if conx == "" {
				continue
			}
			if cond != "" {
				cond += " AND "
				if cnot {
					cond += "NOT "
				}
			}
			cond += conx
		}
	case SQLOr:
		for _, conds := range conds {
			conx := SetCondition(conds, args)
			if conx == "" {
				continue
			}
			if cond != "" {
				cond += " OR "
				if cnot {
					cond += "NOT "
				}
			}
			cond += conx
		}
	case SQLParenthesis:
		if conx := SetCondition(conds.Value, args); conx != "" {
			if cnot {
				cond += "NOT "
			}
			cond += "(" + conx + ")"
		}
	case SQLHelperKV:
		val, not := conds.Value, false
		if v, ok := val.(SQLNot); ok {
			val = v.Value
			not = true
		}
		switch val := val.(type) {
		case SQLIsNull:
			cond += conds.Key + " IS"
			if not {
				cond += " NOT"
			}
			cond += " NULL"
		case SQLLike:
			*args = append(*args, string(val))
			cond += conds.Key
			if not {
				cond += " NOT"
			}
			cond += " LIKE $" + strconv.Itoa(len(*args))
		case SQLIn:
			vins := ""
			for _, v := range val {
				*args = append(*args, v)
				if vins != "" {
					vins += ", "
				}
				vins += "$" + strconv.Itoa(len(*args))
			}
			cond += conds.Key
			if not {
				cond += " NOT"
			}
			cond += " IN (" + vins + ")"
		case SQLIsDistinctFrom:
			*args = append(*args, val.Value)
			cond += conds.Key + " IS"
			if not {
				cond += " NOT"
			}
			cond += " DISTINCT FROM $" + strconv.Itoa(len(*args))
		case SQLInsensitiveLike:
			*args = append(*args, string(val))
			cond += conds.Key
			if not {
				cond += " NOT"
			}
			cond += " ILIKE $" + strconv.Itoa(len(*args))
		case SQLAnyLike:
			*args = append(*args, []string(val))
			cond += conds.Key
			if not {
				cond += " NOT"
			}
			cond += " LIKE ANY ($" + strconv.Itoa(len(*args)) + ")"
		case SQLAnyInsensitiveLike:
			*args = append(*args, []string(val))
			cond += conds.Key
			if not {
				cond += " NOT"
			}
			cond += " ILIKE ANY ($" + strconv.Itoa(len(*args)) + ")"
		default:
			if not {
				cond += " NOT"
			}
			cond += conds.Key + " = " + SetValue(val, args)
		}
		if cond != "" && cnot {
			cond = "NOT (" + cond + ")"
		}
	}
	return
}

func SetOrderBy(m model.OrderBy, args *[]any) (ob string) {
	if m.Name == "" {
		return
	}

	*args = append(*args, m.Name)
	ob += "$" + strconv.Itoa(len(*args)) + "::NAME"

	if m.Sort != "" {
		switch strings.ToLower(m.Sort) {
		case "a", "asc", "ascend", "ascending":
			ob += " ASC"
		case "d", "desc", "descend", "descending":
			ob += " DESC"
		}
	}

	if m.Null != "" {
		switch strings.ToLower(m.Null) {
		case "f", "first":
			ob += " NULLS FIRST"
		case "l", "last":
			ob += " NULLS LAST"
		}
	}

	return
}

func SetOrderBys(m model.OrderBys, args *[]any) (obs string) {
	for _, ob := range m {
		if obs != "" {
			obs += ", "
		}

		obs += SetOrderBy(ob, args)
	}
	return
}

func SetPagination(m model.Pagination, args *[]any) (lo string) {
	if m.Limit < 1 {
		return
	}

	*args = append(*args, m.Limit)
	lo += " LIMIT $" + strconv.Itoa(len(*args))

	offset := m.Limit * (m.Page - 1)
	if offset > 0 {
		*args = append(*args, offset)
		lo += " OFFSET $" + strconv.Itoa(len(*args))
	}

	return
}

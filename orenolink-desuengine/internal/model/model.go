package model

import (
	"strings"

	"github.com/mahmudindes/orenolink-desuengine/internal/utila"
)

const (
	PermissionRead  = "read"
	PermissionWrite = "write"
)

var SecretString = "*****"

type OrderBy struct {
	Name, Sort, Null string
}

func (ob OrderBy) Validate() error {
	if ob.Name == "" {
		return GenericError("order by name cannot be empty")
	}

	if ob.Sort != "" {
		switch strings.ToLower(ob.Sort) {
		case "a", "asc", "ascend", "ascending":
			// Noop
		case "d", "desc", "descend", "descending":
			// Noop
		default:
			return GenericError("order by sort must be ascending or descending")
		}
	}

	if ob.Null != "" {
		switch strings.ToLower(ob.Null) {
		case "f", "first":
			// Noop
		case "l", "last":
			// Noop
		default:
			return GenericError("order by empty must be first or last")
		}
	}

	return nil
}

type OrderBys []OrderBy

func (obs OrderBys) Validate() error {
	for i, ob := range obs {
		if err := ob.Validate(); err != nil {
			return GenericError(utila.OrdinalNumber(i) + " " + err.Error())
		}
	}

	return nil
}

type Pagination struct {
	Page  int
	Limit int
}

func (p Pagination) Validate() error {
	if p.Page < 1 {
		return GenericError("pagination page must be at least 1")
	}

	if p.Limit < 1 {
		return GenericError("pagination limit must be at least 1")
	}

	return nil
}

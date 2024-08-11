package model

import (
	"strconv"
	"time"

	"github.com/mahmudindes/orenolink-desuengine/internal/utila"
)

const (
	UserUsernameMin    = 3
	UserUsernameMax    = 24
	UserAuthSubjectMax = 48
	UserOrderBysMax    = 3
	UserPaginationDef  = 10
	UserPaginationMax  = 50
)

type (
	User struct {
		ID          uint       `json:"id"`
		Username    string     `json:"username"`
		AuthSubject *string    `json:"authSubject"`
		CreatedAt   time.Time  `json:"createdAt"`
		UpdatedAt   *time.Time `json:"updatedAt"`
	}

	AddUser struct {
		Username         string
		AuthSubject      *string
		AuthIDToken      *string
		AuthIDTokenNonce *string
	}

	SetUser struct {
		Username    *string
		AuthSubject *string
		SetNull     []string
	}

	ParamUsers struct {
		Usernames []string

		OrderBys   OrderBys
		Pagination *Pagination
	}
)

func (m *AddUser) Validate() error {
	if m.AuthIDToken != nil && *m.AuthIDToken == "" {
		return GenericError("auth id token cannot be empty")
	}

	return (&SetUser{
		Username:    &m.Username,
		AuthSubject: m.AuthSubject,
	}).Validate()
}

func (m *SetUser) Validate() error {
	if m.Username != nil {
		if *m.Username == "" {
			return GenericError("username cannot be empty")
		}

		if len(*m.Username) < UserUsernameMin {
			max := strconv.FormatInt(UserUsernameMin, 10)
			return GenericError("username must be at least " + max + " characters long")
		}

		if len(*m.Username) > UserUsernameMax {
			max := strconv.FormatInt(UserUsernameMax, 10)
			return GenericError("username must be at most " + max + " characters long")
		}

		if !utila.ValidUsername(*m.Username) {
			return GenericError("username must be combination of letters, numbers, or periods")
		}
	}

	if m.AuthSubject != nil {
		if *m.AuthSubject == "" {
			return GenericError("auth subject cannot be empty")
		}

		if len(*m.AuthSubject) > UserAuthSubjectMax {
			max := strconv.FormatInt(UserAuthSubjectMax, 10)
			return GenericError("auth subject must be at most " + max + " characters long")
		}
	}

	return nil
}

func (m *ParamUsers) Validate() error {
	for i, username := range m.Usernames {
		if err := (&SetUser{Username: &username}).Validate(); err != nil {
			return GenericError(utila.OrdinalNumber(i) + " " + err.Error())
		}
	}

	if err := m.OrderBys.Validate(); err != nil {
		return err
	}

	if m.Pagination != nil {
		if err := m.Pagination.Validate(); err != nil {
			return err
		}
	}

	return nil
}

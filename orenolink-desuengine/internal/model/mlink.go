package model

import (
	"strconv"
	"time"

	"github.com/mahmudindes/orenolink-desuengine/internal/utila"
)

const (
	LinkCodeLength    = 8
	LinkPasswordMin   = 1
	LinkPasswordMax   = 64
	LinkOrderBysMax   = 3
	LinkPaginationDef = 10
	LinkPaginationMax = 50
)

type (
	Link struct {
		ID           uint       `json:"id"`
		Code         string     `json:"code"`
		PasswordHash *string    `json:"passwordHash"`
		UserID       *uint      `json:"userID"`
		UserUsername *string    `json:"userUsername"`
		Rules        []struct{} `json:"rules"`
		Targets      []struct{} `json:"targets"`
		Result       *string    `json:"result"`
		CreatedAt    time.Time  `json:"createdAt"`
		UpdatedAt    *time.Time `json:"updatedAt"`
	}

	AddLink struct {
		Code         *string
		Password     *string
		PasswordHash *string
		UserID       *uint
		UserUsername *string
	}

	SetLink struct {
		Code         *string
		Password     *string
		PasswordHash *string
		UserID       *uint
		UserUsername *string
		SetNull      []string
	}

	ParamLinks struct {
		Codes         []string
		UserUsernames []string

		OrderBys   OrderBys
		Pagination *Pagination
	}
)

func (m *AddLink) Validate() error {
	return (&SetLink{
		Code:         m.Code,
		Password:     m.Password,
		UserID:       m.UserID,
		UserUsername: m.UserUsername,
	}).Validate()
}

func (m *SetLink) Validate() error {
	if m.Code != nil {
		if *m.Code == "" {
			return GenericError("code cannot be empty")
		}

		if len(*m.Code) != LinkCodeLength {
			length := strconv.Itoa(LinkCodeLength)
			return GenericError("code must be " + length + " characters long")
		}
	}

	if m.Password != nil {
		if *m.Password == "" {
			return GenericError("password cannot be empty")
		}

		if len(*m.Password) < LinkPasswordMin {
			max := strconv.FormatInt(LinkPasswordMin, 10)
			return GenericError("password must be at least " + max + " characters long")
		}

		if len(*m.Password) > LinkPasswordMax {
			max := strconv.FormatInt(LinkPasswordMax, 10)
			return GenericError("password must be at most " + max + " characters long")
		}
	}

	if m.UserUsername != nil {
		if err := (&SetUser{Username: m.UserUsername}).Validate(); err != nil {
			return GenericError("user " + err.Error())
		}
	}

	return nil
}

func (m *ParamLinks) Validate() error {
	for i, code := range m.Codes {
		if err := (&SetLink{Code: &code}).Validate(); err != nil {
			return GenericError(utila.OrdinalNumber(i) + " " + err.Error())
		}
	}

	for i, userUsername := range m.UserUsernames {
		if err := (&SetUser{Username: &userUsername}).Validate(); err != nil {
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

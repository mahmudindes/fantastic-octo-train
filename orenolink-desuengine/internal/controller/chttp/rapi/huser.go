package rapi

import (
	"encoding/json"
	"errors"
	"net/http"
	"strconv"

	"github.com/mahmudindes/orenolink-desuengine/internal/model"
)

func modelUser(m *model.User) User {
	return User{
		Username:    m.Username,
		AuthSubject: m.AuthSubject,
		CreatedAt:   m.CreatedAt,
		UpdatedAt:   m.UpdatedAt,
	}
}

func (api *api) AddUser(
	w http.ResponseWriter, r *http.Request,
) {
	ctx := r.Context()
	log := api.logger.WithContext(ctx)

	var data model.AddUser
	switch r.Header.Get("Content-Type") {
	case "application/json":
		var data0 AddUserJSONRequestBody
		if err := json.NewDecoder(r.Body).Decode(&data0); err != nil {
			responseErr(w, "Bad request body.", http.StatusBadRequest)
			log.ErrMessage(err, "Add user decode json body failed.")
			return
		}
		data = model.AddUser{
			Username:         data0.Username,
			AuthSubject:      data0.AuthSubject,
			AuthIDToken:      data0.AuthIDToken,
			AuthIDTokenNonce: data0.AuthIDTokenNonce,
		}
	case "application/x-www-form-urlencoded":
		if err := r.ParseForm(); err != nil {
			responseErr(w, "Bad request body.", http.StatusBadRequest)
			log.ErrMessage(err, "Add user parse form failed.")
			return
		}
		var data0 AddUserFormdataRequestBody
		if err := formDecode(r.PostForm, &data0); err != nil {
			responseErr(w, "Bad form data.", http.StatusBadRequest)
			log.ErrMessage(err, "Add user decode form data failed.")
			return
		}
		data = model.AddUser{
			Username:         data0.Username,
			AuthSubject:      data0.AuthSubject,
			AuthIDToken:      data0.AuthIDToken,
			AuthIDTokenNonce: data0.AuthIDTokenNonce,
		}
	}

	result := new(model.User)
	if err := api.service.AddUser(ctx, data, result); err != nil {
		responseServiceErr(w, err)
		log.ErrMessage(err, "Add user failed.")
		return
	}

	w.Header().Set("Location", r.URL.Path+"/"+result.Username)
	response(w, modelUser(result), http.StatusCreated)
}

func (api *api) GetUser(
	w http.ResponseWriter, r *http.Request,
	username string,
) {
	ctx := r.Context()
	log := api.logger.WithContext(ctx)

	result, err := api.service.GetUserByUsername(ctx, username)
	if err != nil {
		responseServiceErr(w, err)
		log.ErrMessage(err, "Get user failed.")
		return
	}

	response(w, modelUser(result), http.StatusOK)
}

func (api *api) UpdateUser(
	w http.ResponseWriter, r *http.Request,
	username string,
) {
	ctx := r.Context()
	log := api.logger.WithContext(ctx)

	var data model.SetUser
	switch r.Header.Get("Content-Type") {
	case "application/json":
		var data0 UpdateUserJSONRequestBody
		if err := json.NewDecoder(r.Body).Decode(&data0); err != nil {
			responseErr(w, "Bad request body.", http.StatusBadRequest)
			log.ErrMessage(err, "Update user decode json body failed.")
			return
		}
		data = model.SetUser{
			Username:    data0.Username,
			AuthSubject: data0.AuthSubject,
			SetNull:     data0.SetNull,
		}
	case "application/x-www-form-urlencoded":
		if err := r.ParseForm(); err != nil {
			responseErr(w, "Bad request body.", http.StatusBadRequest)
			log.ErrMessage(err, "Update user parse form failed.")
			return
		}
		var data0 UpdateUserFormdataRequestBody
		if err := formDecode(r.PostForm, &data0); err != nil {
			responseErr(w, "Bad form data.", http.StatusBadRequest)
			log.ErrMessage(err, "Update user decode form data failed.")
			return
		}
		data = model.SetUser{
			Username:    data0.Username,
			AuthSubject: data0.AuthSubject,
			SetNull:     data0.SetNull,
		}
	}

	result := new(model.User)
	if err := api.service.UpdateUserByUsername(ctx, username, data, result); err != nil {
		if errors.As(err, &model.ErrNotFound) {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		responseServiceErr(w, err)
		log.ErrMessage(err, "Update user failed.")
		return
	}

	w.Header().Set("Location", r.URL.Path+"/"+result.Username)
	response(w, modelUser(result), http.StatusOK)
}

func (api *api) DeleteUser(
	w http.ResponseWriter, r *http.Request,
	username string,
) {
	ctx := r.Context()
	log := api.logger.WithContext(ctx)

	if err := api.service.DeleteUserByUsername(ctx, username); err != nil {
		responseServiceErr(w, err)
		log.ErrMessage(err, "Delete user failed.")
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (api *api) ListUser(
	w http.ResponseWriter, r *http.Request,
	params ListUserParams,
) {
	ctx := r.Context()
	log := api.logger.WithContext(ctx)

	pagination := model.Pagination{Page: 1, Limit: 10}
	if params.Page != nil {
		pagination.Page = *params.Page
	}
	if params.Limit != nil {
		pagination.Limit = *params.Limit
	}

	paramUsers := model.ParamUsers{
		Usernames:  slicesDereference(params.Username),
		OrderBys:   queryOrderBys(slicesDereference(params.OrderBy)),
		Pagination: &pagination,
	}

	totalCountCh := make(chan int, 1)
	go func() {
		totalCount, err := api.service.CountUser(ctx, paramUsers)
		if err != nil {
			totalCountCh <- -1
			log.ErrMessage(err, "Count user failed.")
			return
		}
		totalCountCh <- totalCount
	}()

	result0, err := api.service.ListUser(ctx, paramUsers)
	if err != nil {
		responseServiceErr(w, err)
		log.ErrMessage(err, "List user failed.")
		return
	}
	totalCount := <-totalCountCh

	wHeader := w.Header()
	wHeader.Set("X-Total-Count", strconv.Itoa(totalCount))
	wHeader.Set("X-Pagination-Limit", strconv.Itoa(pagination.Limit))
	result := make([]User, 0)
	for _, r := range result0 {
		result = append(result, modelUser(r))
	}
	response(w, result, http.StatusOK)
}

func (api *api) GetCurrentUser(
	w http.ResponseWriter, r *http.Request,
) {
	ctx := r.Context()
	log := api.logger.WithContext(ctx)

	result, err := api.service.GetUserByUsername(ctx, api.oauth.SubjectContext(ctx))
	if err != nil {
		responseServiceErr(w, err)
		log.ErrMessage(err, "Get current user failed.")
		return
	}

	response(w, modelUser(result), http.StatusOK)
}

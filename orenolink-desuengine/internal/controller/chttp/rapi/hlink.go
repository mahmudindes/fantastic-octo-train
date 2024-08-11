package rapi

import (
	"encoding/json"
	"errors"
	"net/http"
	"strconv"

	"github.com/mahmudindes/orenolink-desuengine/internal/model"
)

//
// Link
//

func modelLink(m *model.Link) Link {
	return Link{
		Code:              m.Code,
		PasswordProtected: m.PasswordHash != nil,
		UserUsername:      m.UserUsername,
		CreatedAt:         m.CreatedAt,
		UpdatedAt:         m.UpdatedAt,
	}
}

func (api *api) AddLink(
	w http.ResponseWriter, r *http.Request,
) {
	ctx := r.Context()
	log := api.logger.WithContext(ctx)

	var data model.AddLink
	switch r.Header.Get("Content-Type") {
	case "application/json":
		var data0 AddLinkJSONRequestBody
		if err := json.NewDecoder(r.Body).Decode(&data0); err != nil {
			responseErr(w, "Bad request body.", http.StatusBadRequest)
			log.ErrMessage(err, "Add link decode json body failed.")
			return
		}
		data = model.AddLink{
			Code:         data0.Code,
			Password:     data0.Password,
			UserID:       nil,
			UserUsername: data0.UserUsername,
		}
	case "application/x-www-form-urlencoded":
		if err := r.ParseForm(); err != nil {
			responseErr(w, "Bad request body.", http.StatusBadRequest)
			log.ErrMessage(err, "Add link parse form failed.")
			return
		}
		var data0 AddLinkFormdataRequestBody
		if err := formDecode(r.PostForm, &data0); err != nil {
			responseErr(w, "Bad form data.", http.StatusBadRequest)
			log.ErrMessage(err, "Add link decode form data failed.")
			return
		}
		data = model.AddLink{
			Code:         data0.Code,
			Password:     data0.Password,
			UserID:       nil,
			UserUsername: data0.UserUsername,
		}
	}

	result := new(model.Link)
	if err := api.service.AddLink(ctx, data, result); err != nil {
		responseServiceErr(w, err)
		log.ErrMessage(err, "Add link failed.")
		return
	}

	w.Header().Set("Location", r.URL.Path+"/"+result.Code)
	response(w, modelLink(result), http.StatusCreated)
}

func (api *api) GetLink(
	w http.ResponseWriter, r *http.Request,
	code string,
) {
	ctx := r.Context()
	log := api.logger.WithContext(ctx)

	result, err := api.service.GetLinkByCode(ctx, code, nil)
	if err != nil {
		responseServiceErr(w, err)
		log.ErrMessage(err, "Get code failed.")
		return
	}

	response(w, modelLink(result), http.StatusOK)
}

func (api *api) UpdateLink(
	w http.ResponseWriter, r *http.Request,
	code string,
) {
	ctx := r.Context()
	log := api.logger.WithContext(ctx)

	var data model.SetLink
	switch r.Header.Get("Content-Type") {
	case "application/json":
		var data0 UpdateLinkJSONRequestBody
		if err := json.NewDecoder(r.Body).Decode(&data0); err != nil {
			responseErr(w, "Bad request body.", http.StatusBadRequest)
			log.ErrMessage(err, "Update link decode json body failed.")
			return
		}
		data = model.SetLink{
			Code:         data0.Code,
			Password:     data0.Password,
			UserID:       nil,
			UserUsername: data0.UserUsername,
			SetNull:      data0.SetNull,
		}
	case "application/x-www-form-urlencoded":
		if err := r.ParseForm(); err != nil {
			responseErr(w, "Bad request body.", http.StatusBadRequest)
			log.ErrMessage(err, "Update link parse form failed.")
			return
		}
		var data0 UpdateLinkFormdataRequestBody
		if err := formDecode(r.PostForm, &data0); err != nil {
			responseErr(w, "Bad form data.", http.StatusBadRequest)
			log.ErrMessage(err, "Update link decode form data failed.")
			return
		}
		data = model.SetLink{
			Code:         data0.Code,
			Password:     data0.Password,
			UserID:       nil,
			UserUsername: data0.UserUsername,
			SetNull:      data0.SetNull,
		}
	}

	result := new(model.Link)
	if err := api.service.UpdateLinkByCode(ctx, code, data, result); err != nil {
		if errors.As(err, &model.ErrNotFound) {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		responseServiceErr(w, err)
		log.ErrMessage(err, "Update link failed.")
		return
	}

	w.Header().Set("Location", r.URL.Path+"/"+result.Code)
	response(w, modelLink(result), http.StatusOK)
}

func (api *api) DeleteLink(
	w http.ResponseWriter, r *http.Request,
	code string,
) {
	ctx := r.Context()
	log := api.logger.WithContext(ctx)

	if err := api.service.DeleteLinkByCode(ctx, code); err != nil {
		responseServiceErr(w, err)
		log.ErrMessage(err, "Delete link failed.")
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (api *api) ListLink(
	w http.ResponseWriter, r *http.Request,
	params ListLinkParams,
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

	paramLinks := model.ParamLinks{
		Codes:         slicesDereference(params.Code),
		UserUsernames: slicesDereference(params.UserUsername),
		OrderBys:      queryOrderBys(slicesDereference(params.OrderBy)),
		Pagination:    &pagination,
	}

	totalCountCh := make(chan int, 1)
	go func() {
		totalCount, err := api.service.CountLink(ctx, paramLinks)
		if err != nil {
			totalCountCh <- -1
			log.ErrMessage(err, "Count link failed.")
			return
		}
		totalCountCh <- totalCount
	}()

	result0, err := api.service.ListLink(ctx, paramLinks)
	if err != nil {
		responseServiceErr(w, err)
		log.ErrMessage(err, "List link failed.")
		return
	}
	totalCount := <-totalCountCh

	wHeader := w.Header()
	wHeader.Set("X-Total-Count", strconv.Itoa(totalCount))
	wHeader.Set("X-Pagination-Limit", strconv.Itoa(pagination.Limit))
	result := make([]Link, 0)
	for _, r := range result0 {
		result = append(result, modelLink(r))
	}
	response(w, result, http.StatusOK)
}

//

func (api *api) AddLinkRule(
	w http.ResponseWriter, r *http.Request,
	code string,
) {
	panic("unimplemented")
}

func (api *api) AddLinkTarget(
	w http.ResponseWriter, r *http.Request,
	code string,
) {
	panic("unimplemented")
}

func (api *api) DeleteLinkRule(
	w http.ResponseWriter, r *http.Request,
	code string, rid string,
) {
	panic("unimplemented")
}

func (api *api) DeleteLinkTarget(
	w http.ResponseWriter, r *http.Request,
	code string, rid string,
) {
	panic("unimplemented")
}

func (api *api) GetLinkRule(
	w http.ResponseWriter, r *http.Request,
	code string, rid string,
) {
	panic("unimplemented")
}

func (api *api) GetLinkTarget(
	w http.ResponseWriter, r *http.Request,
	code string, rid string,
) {
	panic("unimplemented")
}

func (api *api) ListLinkRule(
	w http.ResponseWriter, r *http.Request,
	code string,
	params ListLinkRuleParams,
) {
	panic("unimplemented")
}

func (api *api) ListLinkTarget(
	w http.ResponseWriter, r *http.Request,
	code string,
	params ListLinkTargetParams,
) {
	panic("unimplemented")
}

func (api *api) UpdateLinkRule(
	w http.ResponseWriter, r *http.Request,
	code string, rid string,
) {
	panic("unimplemented")
}

func (api *api) UpdateLinkTarget(
	w http.ResponseWriter, r *http.Request,
	code string, rid string,
) {
	panic("unimplemented")
}

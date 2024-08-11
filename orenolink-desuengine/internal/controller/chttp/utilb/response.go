package utilb

import (
	"encoding/json"
	"net/http"
)

func ResponseErr404(w http.ResponseWriter) {
	http.Error(w, "Not found.", http.StatusNotFound)
}

func ResponseJSON(w http.ResponseWriter, v any, code int) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("X-Content-Type-Options", "nosniff")
	w.WriteHeader(code)
	data, _ := json.Marshal(v)
	w.Write(data)
}

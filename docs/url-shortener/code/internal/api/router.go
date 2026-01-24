package api

import (
	"net/http"

	"urlshortener/internal/service"

	"github.com/go-chi/chi/v5"
)

func NewRouter(shortener *service.Shortener) http.Handler {
	chi := chi.NewRouter()

	chi.Get("/healthz", healthHandler)
	chi.Get("/", rootHandler)

	return chi
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	_, _ = w.Write([]byte("ok"))
}

func rootHandler(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "ui/index.html")
}

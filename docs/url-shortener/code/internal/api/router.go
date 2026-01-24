package api

import (
	"encoding/json"
	"net/http"

	"urlshortener/internal/service"

	"github.com/go-chi/chi/v5"
)

func NewRouter(shortener *service.Shortener) http.Handler {
	chi := chi.NewRouter()

	chi.Get("/healthz", healthHandler)
	chi.Get("/", rootHandler)
	chi.Handle("/static/*", staticFilesHandler())

	chi.Post("/api/shorten", shortenHandler(shortener))

	return chi
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	_, _ = w.Write([]byte("ok"))
}

func rootHandler(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "ui/index.html")
}

func shortenHandler(shortener *service.Shortener) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			w.Header().Set("Allow", http.MethodPost)
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}

		defer r.Body.Close()

		var req struct {
			URL string `json:"url"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "invalid json payload", http.StatusBadRequest)
			return
		}
		if req.URL == "" {
			http.Error(w, "url is required", http.StatusBadRequest)
			return
		}

		resp, err := shortener.Shorten(service.ShortenRequest{URL: req.URL})
		if err != nil {
			http.Error(w, "failed to shorten url", http.StatusInternalServerError)
			return
		}

		payload := map[string]string{
			"short_code":   resp.ShortCode,
			"original_url": resp.OriginalURL,
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(payload); err != nil {
			http.Error(w, "failed to encode response", http.StatusInternalServerError)
		}
	}
}

func staticFilesHandler() http.Handler {
	const prefix = "/static/"
	fs := http.FileServer(http.Dir("ui"))
	return http.StripPrefix(prefix, fs)
}

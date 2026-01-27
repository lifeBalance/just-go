package api

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"

	shortenerpkg "urlshortener/internal/services/shortener"
	"urlshortener/internal/services/storage"

	"github.com/go-chi/chi/v5"
)

func NewRouter(shortsvc *shortenerpkg.Shortener) http.Handler {
	chi := chi.NewRouter()

	chi.Get("/healthz", healthHandler)
	chi.Get("/", rootHandler)
	chi.Get("/{shortCode}", shortCodeHandler(shortsvc))
	chi.Handle("/static/*", staticFilesHandler())
	chi.Post("/api/shorten", shortenHandler(shortsvc))

	return chi
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	_, _ = w.Write([]byte("ok"))
}

func rootHandler(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "ui/index.html")
}

func shortCodeHandler(shortsvc *shortenerpkg.Shortener) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		shortCode := chi.URLParam(r, "shortCode")
		if shortCode == "" {
			log.Println("⚠️  Empty short code in request")
			http.Error(w, "short-code is required", http.StatusBadRequest)
			return
		}
		entry, err := shortsvc.Lookup(r.Context(), shortCode)
		if err != nil {
			if errors.Is(err, storage.ErrNotFound) {
				log.Printf("⚠️  Short code not found: %s", shortCode)
				http.NotFound(w, r)
				return
			}
			log.Printf("❌ Failed to lookup short code %s: %v", shortCode, err)
			http.Error(w, "failed to resolve short code", http.StatusInternalServerError)
			return
		}
		log.Printf("✅ Redirecting %s -> %s", shortCode, entry.OriginalURL)
		http.Redirect(w, r, entry.OriginalURL, http.StatusFound)
	}
}

func shortenHandler(shortsvc *shortenerpkg.Shortener) http.HandlerFunc {
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
			log.Printf("❌ Failed to decode JSON: %v", err)
			http.Error(w, "invalid json payload", http.StatusBadRequest)
			return
		}
		if req.URL == "" {
			log.Println("⚠️  Empty URL in request")
			http.Error(w, "url is required", http.StatusBadRequest)
			return
		}

		resp, err := shortsvc.Shorten(r.Context(), shortenerpkg.ShortenRequest{URL: req.URL})
		if err != nil {
			log.Printf("❌ Failed to shorten URL: %v", err)
			http.Error(w, "failed to shorten url", http.StatusInternalServerError)
			return
		}

		payload := map[string]string{
			"short_code":   resp.ShortCode,
			"original_url": resp.OriginalURL,
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(payload); err != nil {
			log.Printf("❌ Failed to encode response: %v", err)
			http.Error(w, "failed to encode response", http.StatusInternalServerError)
		}
	}
}

func staticFilesHandler() http.Handler {
	const prefix = "/static/"
	fs := http.FileServer(http.Dir("ui"))
	return http.StripPrefix(prefix, fs)
}

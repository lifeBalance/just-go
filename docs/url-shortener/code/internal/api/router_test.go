package api

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	shortenerpkg "urlshortener/internal/services/shortener"
	"urlshortener/internal/services/storage"
)

type stubGenerator struct {
	code string
	err  error
}

func (s stubGenerator) Generate(context.Context) (string, error) {
	if s.err != nil {
		return "", s.err
	}
	return s.code, nil
}

func TestShortenHandlerSuccess(t *testing.T) {
	store := storage.NewInMemoryStore()
	shortener := shortenerpkg.NewShortener(stubGenerator{code: "stub123"}, store)
	router := NewRouter(shortener)

	body := map[string]string{"url": "https://example.com"}
	buf, err := json.Marshal(body)
	if err != nil {
		t.Fatalf("failed to marshal request body: %v", err)
	}

	req := httptest.NewRequest(http.MethodPost, "/api/shorten", bytes.NewReader(buf))
	rec := httptest.NewRecorder()

	router.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", rec.Code)
	}

	var payload map[string]string
	if err := json.Unmarshal(rec.Body.Bytes(), &payload); err != nil {
		t.Fatalf("failed to decode response: %v", err)
	}

	if payload["short_code"] != "stub123" {
		t.Fatalf("unexpected short code: %s", payload["short_code"])
	}
	if payload["original_url"] != "https://example.com" {
		t.Fatalf("unexpected original url: %s", payload["original_url"])
	}
}

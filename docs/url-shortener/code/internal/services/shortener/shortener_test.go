package shortener

import (
	"context"
	"errors"
	"testing"
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

func TestShortenSuccess(t *testing.T) {
	gen := stubGenerator{code: "stub123"}
	store := storage.NewInMemoryStore()
	svc := NewShortener(gen, store)

	resp, err := svc.Shorten(context.Background(), ShortenRequest{URL: "https://example.com"})
	if err != nil {
		t.Fatalf("Shorten returned error: %v", err)
	}
	if resp.ShortCode != "stub123" {
		t.Fatalf("unexpected short code: %s", resp.ShortCode)
	}
	if resp.OriginalURL != "https://example.com" {
		t.Fatalf("unexpected original url: %s", resp.OriginalURL)
	}
}

func TestShortenValidation(t *testing.T) {
	svc := NewShortener(stubGenerator{code: "unused"}, nil)

	_, err := svc.Shorten(context.Background(), ShortenRequest{})
	if err != ErrEmptyURL {
		t.Fatalf("expected ErrEmptyURL, got %v", err)
	}

	_, err = svc.Shorten(context.Background(), ShortenRequest{URL: "not a url"})
	if err != ErrInvalidURL {
		t.Fatalf("expected ErrInvalidURL, got %v", err)
	}
}

func TestShortenNoGenerator(t *testing.T) {
	svc := NewShortener(nil, nil)

	_, err := svc.Shorten(context.Background(), ShortenRequest{URL: "https://example.com"})
	if err != ErrNoGenerator {
		t.Fatalf("expected ErrNoGenerator, got %v", err)
	}
}

func TestShortenGeneratorError(t *testing.T) {
	want := errors.New("boom")
	svc := NewShortener(stubGenerator{err: want}, nil)

	_, err := svc.Shorten(context.Background(), ShortenRequest{URL: "https://example.com"})
	if err != want {
		t.Fatalf("expected generator error, got %v", err)
	}
}

func TestRandomCodeGeneratorGenerate(t *testing.T) {
	gen := NewRandomCodeGenerator(8)
	ctx := context.Background()

	code, err := gen.Generate(ctx)
	if err != nil {
		t.Fatalf("Generate returned error: %v", err)
	}

	if len(code) != 8 {
		t.Fatalf("expected code length 8, got %d", len(code))
	}

	allowed := make(map[rune]struct{}, len(defaultAlphabet))
	for _, r := range defaultAlphabet {
		allowed[r] = struct{}{}
	}
	for _, r := range code {
		if _, ok := allowed[r]; !ok {
			t.Fatalf("code contains unexpected rune %q", r)
		}
	}
}

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

func defaultTestSettings() ShortenerSettings {
	return ShortenerSettings{
		CodeLength: 6,
		MaxRetries: 3,
	}
}

func TestShortenSuccess(t *testing.T) {
	gen := stubGenerator{code: "stub123"}
	store := storage.NewInMemoryStore()
	svc := NewShortener(gen, store, defaultTestSettings())

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

	stored, err := store.Find(context.Background(), "stub123")
	if err != nil {
		t.Fatalf("expected entry to be stored, got error: %v", err)
	}
	if stored.OriginalURL != "https://example.com" {
		t.Fatalf("stored original url mismatch: %s", stored.OriginalURL)
	}
	if stored.HitCount != 0 {
		t.Fatalf("expected hit count 0, got %d", stored.HitCount)
	}
	if stored.CreatedAt.IsZero() {
		t.Fatalf("expected CreatedAt to be set")
	}
}

func TestShortenValidation(t *testing.T) {
	svc := NewShortener(
		stubGenerator{code: "unused"},
		nil,
		defaultTestSettings(),
	)

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
	svc := NewShortener(nil, nil, defaultTestSettings())

	_, err := svc.Shorten(context.Background(), ShortenRequest{URL: "https://example.com"})
	if err != ErrNoGenerator {
		t.Fatalf("expected ErrNoGenerator, got %v", err)
	}
}

func TestShortenGeneratorError(t *testing.T) {
	want := errors.New("boom")
	svc := NewShortener(stubGenerator{err: want}, nil, defaultTestSettings())

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

// ////////
// LOOKUP
// ////////
func TestLookupSuccess(t *testing.T) {
	ctx := context.Background()
	store := storage.NewInMemoryStore()
	svc := NewShortener(stubGenerator{code: "stub123"}, store, defaultTestSettings())
	_ = store.Save(ctx, storage.Entry{
		ShortCode:   "stub123",
		OriginalURL: "https://example.com",
	})
	entry, err := svc.Lookup(ctx, "stub123")
	if err != nil {
		t.Fatalf("Lookup returned error: %v", err)
	}
	if entry.ShortCode != "stub123" {
		t.Fatalf("expected short code stub123, got %s", entry.ShortCode)
	}
	if entry.OriginalURL != "https://example.com" {
		t.Fatalf("expected original url to match, got %s", entry.OriginalURL)
	}
	if entry.HitCount != 1 {
		t.Fatalf("expected hit count 1, got %d", entry.HitCount)
	}
}
func TestLookupEmptyCode(t *testing.T) {
	want := ErrEmptyCode
	svc := NewShortener(nil, nil, defaultTestSettings())
	ctx := context.Background()

	_, err := svc.Lookup(ctx, "")
	if !errors.Is(err, want) {
		t.Fatalf("expected %v, got %v", want, err)
	}
}

func TestLookupNotFound(t *testing.T) {
	want := storage.ErrNotFound
	ctx := context.Background()

	store := storage.NewInMemoryStore()
	gen := NewRandomCodeGenerator(8)
	svc := NewShortener(gen, store, defaultTestSettings())

	// we need a valid code (alphabet-wise)
	code, err := gen.Generate(ctx)
	if err != nil {
		t.Fatalf("Generate returned error: %v", err)
	}

	_, err = svc.Lookup(ctx, code)
	if !errors.Is(err, want) {
		t.Fatalf("expected %v, got %v", want, err)
	}
}
func TestLookupIncrementError(t *testing.T) {
	ctx := context.Background()
	expectedError := errors.New("increment failed")
	// Create a stubbed store
	stubbedStore := newFailingIncrementStore(expectedError)
	// Create a Shortener service
	svc := NewShortener(stubGenerator{code: "stub123"}, stubbedStore, defaultTestSettings())
	// Save an entry in the stubbed store (ignore the error)
	_ = stubbedStore.Save(ctx, storage.Entry{
		ShortCode:   "stub123",
		OriginalURL: "https://example.com",
	})
	// Lookup the entry we just saved (someone used our short-url, yay!)
	entry, err := svc.Lookup(ctx, "stub123")
	if !errors.Is(err, expectedError) {
		t.Fatalf("expected %v, got %v", expectedError, err)
	}
	if entry.OriginalURL != "https://example.com" {
		t.Fatalf("expected original url to match, got %s", entry.OriginalURL)
	}
}

// ////////////////////
// Stub Storage Service
// ////////////////////
type stubbedIncrementStore struct {
	store  *storage.InMemoryStore // real store
	incErr error
}

func (s *stubbedIncrementStore) Save(
	ctx context.Context,
	entry storage.Entry,
) error {
	return s.store.Save(ctx, entry)
}

func (s *stubbedIncrementStore) Find(
	ctx context.Context,
	shortCode string,
) (storage.Entry, error) {
	return s.store.Find(ctx, shortCode)
}

// ❌ faulty method (needed to reproduce error)
func (s *stubbedIncrementStore) IncrementHits(
	ctx context.Context,
	shortCode string,
) (storage.Entry, error) {
	return storage.Entry{}, s.incErr
}

func newFailingIncrementStore(err error) *stubbedIncrementStore {
	return &stubbedIncrementStore{
		store:  storage.NewInMemoryStore(),
		incErr: err,
	}
}

// Use a small sequence-based generator:
type sequenceGenerator struct {
	codes []string
	idx   int
}

func (g *sequenceGenerator) Generate(context.Context) (string, error) {
	code := g.codes[g.idx]
	g.idx++
	return code, nil
}

func TestShortenRetriesOnCollision(t *testing.T) {
	ctx := context.Background()

	// Seed the generator
	codes := []string{"dup123", "fresh456"}
	seqGen := &sequenceGenerator{codes: codes}
	store := storage.NewInMemoryStore()
	_ = store.Save(ctx, storage.Entry{
		ShortCode:   codes[0],
		OriginalURL: "existing",
	})

	svc := NewShortener(seqGen, store, defaultTestSettings())

	req := ShortenRequest{URL: "https://example.com"}
	_, err := svc.Shorten(ctx, req)
	if err != nil {
		t.Fatalf("expected %v after retry, got %v", nil, err)
	}
}

func TestShortenTooManyCollisions(t *testing.T) {
	want := ErrTooManyCollisions
	ctx := context.Background()
	stubCode := "stub123"

	store := storage.NewInMemoryStore()
	_ = store.Save(ctx, storage.Entry{ShortCode: stubCode, OriginalURL: "existing"})

	svc := NewShortener(stubGenerator{code: stubCode}, store, defaultTestSettings()) // ❌ Faulty generator
	req := ShortenRequest{URL: "https://example.com"}
	_, err := svc.Shorten(ctx, req)
	if err != want {
		t.Fatalf("expected %v, got %v", want, err)
	}
}

func TestShortenSaveErrorBubblesUp(t *testing.T) {
	ctx := context.Background()
	stubStore := &otherErrorStore{
		err: errors.New("boom"),
	}
	want := stubStore.err

	svc := NewShortener(stubGenerator{code: "stub123"}, stubStore, defaultTestSettings())
	req := ShortenRequest{URL: "https://example.com"}
	_, err := svc.Shorten(ctx, req)
	if err != want {
		t.Fatalf("expected %v, got %v", want, err)
	}
}

// ////////////////////
// Stub Storage Service
// ////////////////////
type otherErrorStore struct {
	err error
}

func (s otherErrorStore) Save(context.Context, storage.Entry) error {
	return s.err
}
func (otherErrorStore) Find(context.Context, string) (storage.Entry, error) {
	return storage.Entry{}, storage.ErrNotFound
}
func (otherErrorStore) IncrementHits(context.Context, string) (storage.Entry, error) {
	return storage.Entry{}, nil
}

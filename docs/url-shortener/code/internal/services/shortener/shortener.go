package shortener

import (
	"context"
	"errors"
	"math/rand"
	"net/url"
	"sync"
	"time"
	"urlshortener/internal/services/storage"
)

var (
	ErrEmptyURL          = errors.New("url is required")
	ErrInvalidURL        = errors.New("url is invalid")
	ErrNoGenerator       = errors.New("code generator unavailable")
	ErrEmptyCode         = errors.New("short-code is empty")
	ErrTooManyCollisions = errors.New("too many collisions")
)

type ShortenerSettings struct {
	CodeLength int
	MaxRetries int
}

type Shortener struct {
	generator CodeGenerator
	store     storage.Store
	settings  ShortenerSettings
}

type CodeGenerator interface {
	Generate(ctx context.Context) (string, error)
}

type ShortenRequest struct {
	URL string
}

type ShortenResponse struct {
	ShortCode   string
	OriginalURL string
}

func NewShortener(
	gen CodeGenerator,
	store storage.Store,
	settings ShortenerSettings,
) *Shortener {
	return &Shortener{generator: gen, store: store}
}

func (s *Shortener) Shorten(
	ctx context.Context,
	req ShortenRequest,
) (ShortenResponse, error) {
	if req.URL == "" {
		return ShortenResponse{}, ErrEmptyURL
	}
	if _, err := url.ParseRequestURI(req.URL); err != nil {
		return ShortenResponse{}, ErrInvalidURL
	}
	if s.generator == nil {
		return ShortenResponse{}, ErrNoGenerator
	}

	entry := storage.Entry{
		ShortCode:   "",
		OriginalURL: req.URL,
		CreatedAt:   time.Now().UTC(),
		CreatedBy:   "coming soon",
		HitCount:    0,
	}

	const maxAttempts = 3
	for i := range maxAttempts {
		code, err := s.generator.Generate(ctx)
		if err != nil {
			return ShortenResponse{}, err
		}
		entry.ShortCode = code
		err = s.store.Save(ctx, entry)
		if err != nil {
			if errors.Is(err, storage.ErrConflict) {
				if i < maxAttempts-1 {
					continue
				}
				return ShortenResponse{}, ErrTooManyCollisions
			}
			return ShortenResponse{}, err
		} else {
			break
		}
	}
	return ShortenResponse{
		ShortCode:   entry.ShortCode,
		OriginalURL: req.URL,
	}, nil
}

func (s *Shortener) Lookup(
	ctx context.Context,
	shortCode string,
) (storage.Entry, error) {
	if shortCode == "" {
		return storage.Entry{}, ErrEmptyCode
	}
	entry, err := s.store.Find(ctx, shortCode)
	if err != nil {
		return storage.Entry{}, err
	}
	updated, incErr := s.store.IncrementHits(ctx, shortCode)
	if incErr == nil {
		return updated, nil
	}
	// If increment fails, surface the original entry so callers can still redirect.
	return entry, incErr
}

// RandomCodeGenerator produces random alphanumeric codes of fixed length.
type RandomCodeGenerator struct {
	mu       sync.Mutex
	rnd      *rand.Rand
	alphabet []rune
	length   int
}

var defaultAlphabet = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")

func NewRandomCodeGenerator(length int) *RandomCodeGenerator {
	return &RandomCodeGenerator{
		rnd:      rand.New(rand.NewSource(rand.Int63())),
		alphabet: defaultAlphabet,
		length:   length,
	}
}

func (g *RandomCodeGenerator) Generate(_ context.Context) (string, error) {
	g.mu.Lock()
	defer g.mu.Unlock()
	code := make([]rune, g.length)
	for i := range code {
		code[i] = g.alphabet[g.rnd.Intn(len(g.alphabet))]
	}
	return string(code), nil
}

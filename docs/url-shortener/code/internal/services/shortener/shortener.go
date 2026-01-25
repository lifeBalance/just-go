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
	ErrEmptyURL    = errors.New("url is required")
	ErrInvalidURL  = errors.New("url is invalid")
	ErrNoGenerator = errors.New("code generator unavailable")
)

type ShortenRequest struct {
	URL string
}

type ShortenResponse struct {
	ShortCode   string
	OriginalURL string
}

type CodeGenerator interface {
	Generate(ctx context.Context) (string, error)
}
type Shortener struct {
	generator CodeGenerator
	store     storage.Store
}

func NewShortener(gen CodeGenerator, store storage.Store) *Shortener {
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
	code, err := s.generator.Generate(ctx)
	if err != nil {
		return ShortenResponse{}, err
	}
	entry := storage.Entry{
		ShortCode:   code,
		OriginalURL: req.URL,
		CreatedAt:   time.Now().UTC(),
		CreatedBy:   "coming soon",
		HitCount:    0,
	}
	err = s.store.Save(ctx, entry)
	if err != nil {
		if errors.Is(err, storage.ErrConflict) {
			return ShortenResponse{}, storage.ErrConflict // or retry a new code
		}
		return ShortenResponse{}, err
	}
	return ShortenResponse{
		ShortCode:   code,
		OriginalURL: req.URL,
	}, nil
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

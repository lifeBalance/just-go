package storage

import (
	"context"
	"errors"
	"time"
)

// Entry captures everything we persist for a shortened URL.
type Entry struct {
	ShortCode   string
	OriginalURL string
	CreatedAt   time.Time
	CreatedBy   string
	HitCount    int64
}

var (
	ErrNotFound = errors.New("storage: short code not found")
	ErrConflict = errors.New("storage: short code already exists")
)

// Store defines the persistence contract the shortener service depends on.
type Store interface {
	Save(ctx context.Context, entry Entry) error
	Find(ctx context.Context, shortCode string) (Entry, error)
	IncrementHits(ctx context.Context, shortCode string) (Entry, error)
}

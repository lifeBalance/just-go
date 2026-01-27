package storage

import (
	"context"
	"sync"
	"time"
)

// InMemoryStore is a simple, goroutine-safe implementation useful for tests.
type InMemoryStore struct {
	mu      sync.RWMutex
	entries map[string]Entry
}

func NewInMemoryStore() *InMemoryStore {
	return &InMemoryStore{
		entries: make(map[string]Entry),
	}
}

func (s *InMemoryStore) Save(_ context.Context, entry Entry) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	if _, ok := s.entries[entry.ShortCode]; ok {
		return ErrConflict
	}
	if entry.CreatedAt.IsZero() {
		entry.CreatedAt = time.Now().UTC()
	}
	s.entries[entry.ShortCode] = entry
	return nil
}

func (s *InMemoryStore) Find(_ context.Context, shortCode string) (Entry, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	entry, ok := s.entries[shortCode]
	if !ok {
		return Entry{}, ErrNotFound
	}
	return entry, nil
}

func (s *InMemoryStore) IncrementHits(_ context.Context, shortCode string) (Entry, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	entry, ok := s.entries[shortCode]
	if !ok {
		return Entry{}, ErrNotFound
	}
	entry.HitCount++
	s.entries[shortCode] = entry
	return entry, nil
}

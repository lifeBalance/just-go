package postgres

import (
	"context"
	"database/sql"
	"errors"
	"time"
	"urlshortener/internal/services/storage"
)

type Store struct {
	db *sql.DB
}

func NewStore(db *sql.DB) *Store {
	return &Store{db: db}
}

func (s *Store) Save(ctx context.Context, entry storage.Entry) error {
	query := `
		INSERT INTO urls (short_code, original_url, created_at, created_by, hit_count)
		VALUES ($1, $2, $3, $4, $5)
	`

	createdAt := entry.CreatedAt
	if createdAt.IsZero() {
		createdAt = time.Now().UTC()
	}

	_, err := s.db.ExecContext(ctx, query,
		entry.ShortCode,
		entry.OriginalURL,
		createdAt,
		entry.CreatedBy,
		entry.HitCount,
	)

	if err != nil {
		// Check for unique constraint violation (duplicate short_code)
		// This is PostgreSQL-specific error handling
		if isPgUniqueViolation(err) {
			return storage.ErrConflict
		}
		return err
	}

	return nil
}

func (s *Store) Find(ctx context.Context, shortCode string) (storage.Entry, error) {
	query := `
		SELECT short_code, original_url, created_at, created_by, hit_count
		FROM urls
		WHERE short_code = $1
	`

	var entry storage.Entry
	err := s.db.QueryRowContext(ctx, query, shortCode).Scan(
		&entry.ShortCode,
		&entry.OriginalURL,
		&entry.CreatedAt,
		&entry.CreatedBy,
		&entry.HitCount,
	)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return storage.Entry{}, storage.ErrNotFound
		}
		return storage.Entry{}, err
	}

	return entry, nil
}

func (s *Store) IncrementHits(ctx context.Context, shortCode string) (storage.Entry, error) {
	query := `
		UPDATE urls
		SET hit_count = hit_count + 1
		WHERE short_code = $1
		RETURNING short_code, original_url, created_at, created_by, hit_count
	`

	var entry storage.Entry
	err := s.db.QueryRowContext(ctx, query, shortCode).Scan(
		&entry.ShortCode,
		&entry.OriginalURL,
		&entry.CreatedAt,
		&entry.CreatedBy,
		&entry.HitCount,
	)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return storage.Entry{}, storage.ErrNotFound
		}
		return storage.Entry{}, err
	}

	return entry, nil
}

// Helper to detect PostgreSQL unique constraint violations
func isPgUniqueViolation(err error) bool {
	// This is a simplified check - you might want to use pgconn.PgError
	// from github.com/jackc/pgx/v5/pgconn for more robust checking
	return err != nil && (
	// Check error message for unique violation hints
	// Note: This is fragile - better to use pgconn.PgError
	sql.ErrNoRows != err &&
		(err.Error() == "duplicate key value violates unique constraint" ||
			err.Error() == "UNIQUE constraint failed"))
}

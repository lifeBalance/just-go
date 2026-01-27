-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS urls (
    short_code VARCHAR(50) PRIMARY KEY,
    original_url TEXT NOT NULL,
    created_by TEXT NOT NULL DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    hit_count INTEGER NOT NULL DEFAULT 0
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE urls;
-- +goose StatementEnd
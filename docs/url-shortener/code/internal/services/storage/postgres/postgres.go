package postgres

import (
	"database/sql"
	"fmt"

	_ "github.com/jackc/pgx/v5/stdlib"
)

type PostgresConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	Database string
	SSLMode  string
}

func Open(cfg PostgresConfig) (*sql.DB, error) {
	stringifiedConfig := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		cfg.Host,
		cfg.Port,
		cfg.User,
		cfg.Password,
		cfg.Database,
		cfg.SSLMode)

	conn, err := sql.Open("pgx", stringifiedConfig)
	if err != nil {
		return nil, fmt.Errorf("open: %w", err)
	}

	return conn, nil
}

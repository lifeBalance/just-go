package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"

	"urlshortener/internal/api"
	"urlshortener/internal/services/shortener"
	shortenerpkg "urlshortener/internal/services/shortener"
	"urlshortener/internal/services/storage/postgres"

	"github.com/joho/godotenv"
)

type appConfig struct {
	Server struct {
		Address string
	}
	ShortenerSettings shortener.ShortenerSettings
	PostgresConfig    postgres.PostgresConfig
}

func main() {
	cfg, err := loadEnvConfig()
	if err != nil {
		panic(err)
	}

	err = run(cfg)
	if err != nil {
		panic(err)
	}
}

func run(cfg appConfig) error {
	// Connect to DB
	conn, err := postgres.Open(cfg.PostgresConfig)
	if err != nil {
		return err
	}
	defer conn.Close()

	// store := storage.NewInMemoryStore()
	store := postgres.NewStore(conn)
	codeGenerator := shortenerpkg.NewRandomCodeGenerator(
		cfg.ShortenerSettings.CodeLength,
	)
	shortenerSvc := shortenerpkg.NewShortener(
		codeGenerator,
		store,
		cfg.ShortenerSettings,
	)
	appRouter := api.NewRouter(shortenerSvc)

	addr := fmt.Sprintf("%s", cfg.Server.Address)
	log.Printf("🚀 listening on %s 🚀", addr)    // 🪵 log message
	err = http.ListenAndServe(addr, appRouter) // 🚀 start HTTP server
	if err != nil {
		log.Fatalf("🚨 server stopped: %v", err)
	}
	return nil
}

func loadEnvConfig() (appConfig, error) {
	var cfg appConfig

	// Load .env file (optional - can use system env vars)
	if err := godotenv.Load(); err != nil {
		log.Println("⚠️  No .env file found, using system environment variables")
	}

	// Server configuration
	port := getEnvOrDefault("PORT", "8080")
	cfg.Server.Address = ":" + port

	// Shortener configuration
	cfg.ShortenerSettings.CodeLength = getEnvAsInt("CODE_LENGTH", 6)
	cfg.ShortenerSettings.MaxRetries = getEnvAsInt("SHORTENER_MAX_RETRIES", 3)

	maxRetries := os.Getenv("SHORTENER_MAX_RETRIES")
	if maxRetries == "" {
		cfg.ShortenerSettings.MaxRetries = 3
	} else {
		cfg.ShortenerSettings.MaxRetries, _ = strconv.Atoi(maxRetries)
	}

	// PostgreSQL configuration
	cfg.PostgresConfig = postgres.PostgresConfig{
		Host:     getEnvOrDefault("PSQL_HOST", "localhost"),
		Port:     getEnvOrDefault("PSQL_PORT", "5432"),
		User:     getEnvOrDefault("PSQL_USER", "urlshortener"),
		Password: os.Getenv("PSQL_PASSWORD"),
		Database: getEnvOrDefault("PSQL_DATABASE", "urlshortener"),
		SSLMode:  getEnvOrDefault("PSQL_SSLMODE", "disable"),
	}

	// Validate required config
	if cfg.PostgresConfig.Password == "" {
		return cfg, fmt.Errorf("PSQL_PASSWORD environment variable is required")
	}

	// Log configuration (without sensitive data)
	log.Printf("📋 Configuration loaded:")
	log.Printf("   Server: %s", cfg.Server.Address)
	log.Printf("   Code Length: %d", cfg.ShortenerSettings.CodeLength)
	log.Printf("   Max Retries: %d", cfg.ShortenerSettings.MaxRetries)
	log.Printf("   Database: %s@%s:%s/%s",
		cfg.PostgresConfig.User,
		cfg.PostgresConfig.Host,
		cfg.PostgresConfig.Port,
		cfg.PostgresConfig.Database)

	return cfg, nil
}

// Helper functions
func getEnvOrDefault(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getEnvAsInt(key string, defaultValue int) int {
	valueStr := os.Getenv(key)
	if valueStr == "" {
		return defaultValue
	}

	value, err := strconv.Atoi(valueStr)
	if err != nil {
		log.Printf("⚠️  Invalid integer value for %s: %s, using default: %d", key, valueStr, defaultValue)
		return defaultValue
	}

	return value
}

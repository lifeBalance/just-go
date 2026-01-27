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
	"urlshortener/internal/services/storage"
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

	store := storage.NewInMemoryStore()
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
		log.Fatalf("server stopped: %v", err)
	}
	return nil
}

func loadEnvConfig() (appConfig, error) {
	var cfg appConfig

	// Load .env file
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
		return cfg, err
	}
	// Server configuration
	// 🌡️ read PORT env, default 8080
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	cfg.Server.Address = ":" + port

	// Shortener configuration
	codeLength := os.Getenv("CODE_LENGTH")
	if codeLength == "" {
		cfg.ShortenerSettings.CodeLength = 6
	} else {
		cfg.ShortenerSettings.CodeLength, _ = strconv.Atoi(codeLength)
	}

	maxRetries := os.Getenv("SHORTENER_MAX_RETRIES")
	if maxRetries == "" {
		cfg.ShortenerSettings.MaxRetries = 3
	} else {
		cfg.ShortenerSettings.MaxRetries, _ = strconv.Atoi(maxRetries)
	}

	return cfg, nil
}

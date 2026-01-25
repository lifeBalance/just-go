package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"urlshortener/internal/api"
	shortenerpkg "urlshortener/internal/services/shortener"
	"urlshortener/internal/services/storage"
)

func main() {
	store := storage.NewInMemoryStore()
	codeGenerator := shortenerpkg.NewRandomCodeGenerator(6)
	shortenerSvc := shortenerpkg.NewShortener(codeGenerator, store)
	appRouter := api.NewRouter(shortenerSvc)

	addr := fmt.Sprintf(":%s", port())
	log.Printf("🚀 listening on %s 🚀", addr)     // 🪵 log message
	err := http.ListenAndServe(addr, appRouter) // 🚀 start HTTP server
	if err != nil {
		log.Fatalf("server stopped: %v", err)
	}
}

// 🌡️ read PORT env, default 8080
func port() string {
	p := os.Getenv("PORT")
	if p == "" {
		return "8080"
	}
	return p
}

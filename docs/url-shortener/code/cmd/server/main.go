package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"urlshortener/internal/api"
	"urlshortener/internal/service"
)

func main() {
	shortener := service.NewShortener()   // 🔧 init services
	appRouter := api.NewRouter(shortener) // 💉 inject service
	addr := fmt.Sprintf(":%s", port())    // 🚀 start HTTP server
	log.Printf("🚀 listening on %s 🚀", addr)
	if err := http.ListenAndServe(addr, appRouter); err != nil {
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

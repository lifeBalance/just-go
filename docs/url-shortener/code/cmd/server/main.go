package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"urlshortener/internal/api"
)

func main() {
	appRouter := api.NewRouter()        // 🔧 assemble router
	addr := fmt.Sprintf(":%s", port())  // 🚀 start HTTP server
	log.Printf("listening on %s", addr) // 🪵 log some message
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

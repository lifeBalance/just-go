package main

import (
	"mywebapp/handlers"
	"net/http"
)

// Custom router function
func router(w http.ResponseWriter, r *http.Request) {
	switch r.URL.Path {
	case "/":
		handlers.Home(w, r)
	case "/contact":
		handlers.Contact(w, r)
	default:
		http.Error(w, "404 page not found", http.StatusNotFound)
	}
}

func main() {
	http.ListenAndServe(":3000", http.HandlerFunc(router))
}

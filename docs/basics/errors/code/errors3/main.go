package main

import (
	"errors"
	"fmt"
)

var ErrNotFound = errors.New("not found")

func lookupUser(id string) error {
	return fmt.Errorf("lookup user %q: %w", id, ErrNotFound)
}

func createOrder() error {
	if err := lookupUser("u123"); err != nil {
		return fmt.Errorf("create order: %w", err)
	}
	return nil
}

func main() {
	err := createOrder()

	switch {
	case err == nil:
		fmt.Println("ok")
	case errors.Is(err, ErrNotFound):
		fmt.Println("user missing → show 404 or similar")
	default:
		fmt.Println("unexpected error:", err)
	}
}

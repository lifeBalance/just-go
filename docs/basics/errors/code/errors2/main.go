package main

import (
	"errors"
	"fmt"
)

func main() {
	err := CreateOrg() // from the example above

	// Print the full chain
	for e := err; e != nil; e = errors.Unwrap(e) {
		fmt.Println("->", e)
	}

	// Get the root cause
	root := err
	for {
		u := errors.Unwrap(root)
		if u == nil {
			break
		}
		root = u
	}
	fmt.Println("root:", root) // "connection failed"
}

func Connect() error {
	return errors.New("connection failed")
}

func CreateUser() error {
	err := Connect()
	if err != nil {
		return fmt.Errorf("create user: %w", err)
	}
	return nil
}

func CreateOrg() error {
	err := CreateUser()
	if err != nil {
		return fmt.Errorf("create org: %w", err)
	}
	return nil
}

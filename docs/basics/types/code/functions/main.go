package main

import "fmt"

func main() {
	var greet func(string) string

	greet = func(name string) string {
		return "Hello, " + name
	}

	fmt.Println(greet("Alice")) // Hello, Alice

	greet = func(name string) string {
		return "Hi, " + name
	}

	fmt.Println(greet("Bob")) // Hi, Bob
}

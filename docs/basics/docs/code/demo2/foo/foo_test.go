package foo_test

import (
	"fmt"

	"example.com/demo2/foo"
)

func ExampleGreeter_Greet() {
	g := foo.New("Welcome")
	fmt.Println(g.Greet("Dana"))
	// Output: Welcome, Dana!
}

func ExampleGreeter_Greet_default() {
	g := foo.New("")
	fmt.Println(g.Greet(""))
	// Output: Hello, friend!
}

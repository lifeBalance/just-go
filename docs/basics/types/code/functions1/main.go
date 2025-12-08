package main

import (
	"fmt"
	"reflect"
)

func greet(name string) string {
	return "Hello, " + name
}

func main() {
	fmt.Println(reflect.TypeOf(greet))        // func(string) string
	fmt.Println(reflect.TypeOf(greet).Kind()) // func

	var greet2 func(string) string
	fmt.Printf("%p\n", greet2) // 0x0
	fmt.Println(greet2 == nil) // true

	greet2 = greet
	fmt.Printf("%p\n", greet)  // 0x104c6d450
	fmt.Printf("%p\n", greet2) // 0x104c6d450
}

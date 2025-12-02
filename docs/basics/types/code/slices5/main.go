package main

import (
	"fmt"
)

func main() {
	names := []string{
		"Bob",
		"Lisa",
		"Frank",
	}
	names = append(names, "Ralphie")
	fmt.Println(names) // [Bob Lisa Frank Ralphie]
}

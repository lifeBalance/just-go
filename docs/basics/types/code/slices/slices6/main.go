package main

import (
	"fmt"
)

func main() {
	names := []string{}         // Empty slice
	names2 := make([]string, 0) // Empty slice
	names3 := names2[:]         // Empty slice

	fmt.Println(names == nil)  // false
	fmt.Println(names2 == nil) // false
	fmt.Println(names3 == nil) // false
}

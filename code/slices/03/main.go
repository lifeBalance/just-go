package main

import "fmt"

func main() {

	// Declaring a slice
	var s []byte

	// Initializing a slice
	s = make([]byte, 5, 5)

	// Slicing
	s = s[2:4]

	fmt.Printf("The slice is: %v \n", s)
	fmt.Printf("The length of the slice is: %d \n", len(s))
	fmt.Printf("The cap of the slice is: %d \n", cap(s))
	fmt.Printf("slice == nil?: %v \n", s == nil)
}

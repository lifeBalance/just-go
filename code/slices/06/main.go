package main

import "fmt"

func main() {

	// Declaring a slice
	var s1 []byte

	// Initializing a slice
	s1 = make([]byte, 5, 8)

	// Slicing a slice
	s2 := s1[:cap(s1)]

	fmt.Printf("\ns1: %v \n", s1)
	fmt.Printf("The length of s1: %d \n", len(s1))
	fmt.Printf("The cap of s1: %d \n\n", cap(s1))

	fmt.Printf("s2: %v \n", s2)
	fmt.Printf("The length of s2 is: %d \n", len(s2))
	fmt.Printf("The cap of s2 is: %d \n\n", cap(s2))
}

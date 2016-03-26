package main

import "fmt"

func main() {

	// Creating an array
	a := [7]int{1, 3, 5, 7}

	// Slicing an array
	s1 := a[2:5]

	// Slicing a slice
	s2 := s1[:cap(s1)]

	fmt.Printf("The array: %v \n", a)
	fmt.Printf("Length: %v \n", len(a))
	fmt.Printf("Capacity? %v \n\n", cap(a))

	fmt.Printf("The slice s1: %v \n", s1)
	fmt.Printf("Length: %v \n", len(s1))
	fmt.Printf("Capacity: %v \n\n", cap(s1))

	fmt.Printf("The slice s2: %v \n", s2)
	fmt.Printf("Length: %v \n", len(s2))
	fmt.Printf("Capacity: %v \n", cap(s2))
}

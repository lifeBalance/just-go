package main

import "fmt"

func main() {

	// Short syntax for creating slices
	s := []int{33, 3, 5}

	fmt.Printf("The slice is: %v \n", s)
	fmt.Printf("The length of the slice is: %d \n", len(s))
	fmt.Printf("The cap of the slice is: %d \n", cap(s))
}

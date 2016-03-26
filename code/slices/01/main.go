package main

import "fmt"

func main() {

	// Creating an array
	a := [7]int{1, 3, 5, 7}

	// Slicing an array
	s := a[2:5]

	fmt.Printf("The array: %v \n", a)
	fmt.Printf("Length: %v \n", len(a))
	fmt.Printf("Capacity? %v \n\n", cap(a))

	fmt.Printf("The slice: %v \n", s)
	fmt.Printf("Length: %v \n", len(s))
	fmt.Printf("Capacity: %v \n", cap(s))
}

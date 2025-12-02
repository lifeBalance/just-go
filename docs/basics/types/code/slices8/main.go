package main

import "fmt"

func main() {
	a := [7]int{1, 3, 5, 7} // Creating an array

	s1 := a[:2]        // Slicing an array
	s2 := s1[:cap(s1)] // Extending to full capacity

	fmt.Println(s1) // [1 3]
	fmt.Println(s2) // [1 3 5 7 0 0 0]
}

package main

import "fmt"

func main() {
	a := [7]int{1, 3, 5, 7} // Creating an array

	s1 := a[2:5]       // Slicing an array
	s2 := s1[:cap(s1)] // Slicing a slice

	fmt.Println(s1) // [5 7 0]
	fmt.Println(s2) // [5 7 0 0 0]
}

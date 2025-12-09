package main

import "fmt"

func main() {
	a := [...]int{1, 2, 3}

	s1 := a[:] // Slicing an array
	s1[0], s1[1] = 100, 300
	fmt.Println(a) // [100 300 5 7 9]

	s2 := s1[:] // Slicing a slice
	s2[0], s2[1] = 42, 43
	fmt.Println(a) // [42 43 5 7 9]
}

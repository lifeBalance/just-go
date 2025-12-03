package main

import "fmt"

func main() {
	a := [...]int{1, 3, 5, 7, 9}

	s1 := a[:]
	s1[0], s1[1] = 100, 300
	fmt.Println(a) // [100 300 5 7 9]

	s2 := s1[:]
	s2[0], s2[1] = 42, 43
	fmt.Println(a) // [42 43 5 7 9]
}

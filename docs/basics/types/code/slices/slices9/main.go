package main

import "fmt"

func main() {
	a := [5]int{1, 2, 3}

	s1 := a[:3]
	s2 := a[:3]
	s1 = append(s1, 4, 5)
	s2 = append(s2, 4, 5, 6)
	s1[0] = 100
	s2[0] = 101

	fmt.Println(a)  // [100 2 3 4 5]
	fmt.Println(s1) // [100 2 3 4 5]
	fmt.Println(s2) // [101 2 3 4 5 6]
}

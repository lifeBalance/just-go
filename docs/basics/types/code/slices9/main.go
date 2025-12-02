package main

import "fmt"

func main() {
	a := [5]int{1, 3, 5, 7, 9} // Creating an array

	s1 := a[1:3]    // Slicing an array
	fmt.Println(s1) // [3 5]

	s1 = append(s1, 10, 11, 12, 13, 14, 15) // Extends and adds elements
	fmt.Println(s1)                         // [3 5 10 11 12 13 14 15]
	fmt.Println(a)                          // [1 3 5 7 9]
}

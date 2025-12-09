package main

import "fmt"

func main() {
	a := [7]int{1, 3, 5, 7}     // Creating an array
	fmt.Println(a)              // [1 3 5 7 0 0 0]
	fmt.Println(len(a), cap(a)) // 7 7

	s := a[2:5]                 // Slicing an array
	fmt.Println(s)              // [5 7 0]
	fmt.Println(len(s), cap(s)) // 3 5
}

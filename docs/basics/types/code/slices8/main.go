package main

import "fmt"

func main() {
	a := [...]int{1, 2, 3} // Original array

	s := a[:] // Slice at full-capacity
	s[0], s[1], s[2] = 100, 200, 300
	// s[3] = 400 // ❌ panic: runtime error

	fmt.Println(s) // [100 200 300]
	fmt.Println(a) // [100 200 300]
}

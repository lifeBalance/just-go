package main

import "fmt"

func main() {
	a := [...]int{1, 2, 3}

	s1 := a[:]              // Slicing an array
	s1[0], s1[1] = 100, 300 // ✅ Changing the 1st slice
	fmt.Println(a)          // [100 300 5 7 9] 👈 (underlying array changed)

	s2 := s1[:]           // Slicing a slice
	s2[0], s2[1] = 42, 43 // ✅ Changing the 2nd slice
	fmt.Println(a)        // [42 43 5 7 9]  👈 (underlying array changed again)
}

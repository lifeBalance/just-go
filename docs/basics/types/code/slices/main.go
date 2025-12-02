package main

import "fmt"

func main() {
	a := [7]int{1, 3, 5, 7} // Creating an array
	fmt.Println("Array:", a)
	fmt.Println("Length: ", len(a), "/ Capacity:", cap(a))

	s := a[2:5] // Slicing an array
	fmt.Println("\nSlice:", s)
	fmt.Println("Length: ", len(s), "/ Capacity:", cap(s))
}

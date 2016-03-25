package main

import "fmt"

func main() {

	a := [...]int{
		33,
		4,
		12,
		13,
	}

	fmt.Printf("The array 'a': %v \n", a)
	fmt.Printf("The length of 'a' is: %d \n", len(a))
}

package main

import "fmt"

func main() {

	var a [4]int

	a[0], a[1], a[2] = 22, 44, 78
	a[3] = a[0] + a[2]

	fmt.Printf("The array 'a': %v \n", a)
	fmt.Printf("The length of 'a' is: %d \n", len(a))
}

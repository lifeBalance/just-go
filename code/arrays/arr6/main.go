package main

import "fmt"

func main() {

	a := [4]int{22, 44, 78, 100}

	last := a[len(a)-1]

	fmt.Printf("The last element of the array is: %v \n", last)
}

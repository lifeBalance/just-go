package main

import "fmt"

func main() {

	a := [4]int{22, 44, 78, 100}

	a[len(a)] = 101

	fmt.Printf("The array contains now: %v \n", a)
}

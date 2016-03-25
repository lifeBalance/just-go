package main

import "fmt"

func main() {

	a := [4]int{1, 2, 3}
	b := a

	a[0] = 100
	fmt.Println("a =", a) // [100 2 3]
	fmt.Println("b =", b) // [1 2 3]
}

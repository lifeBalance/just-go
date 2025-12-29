package main

import "fmt"

func main() {
	var anInteger int
	var x interface{} = 7 // x has dynamic type int and value 7

	val, ok := x.(int)

	if ok {
		anInteger = val
		fmt.Println(anInteger)
	} else {
		fmt.Println("x is not an integer")
	}
}

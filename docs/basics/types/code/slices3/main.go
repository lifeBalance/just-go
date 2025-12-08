package main

import (
	"fmt"
	"reflect"
)

func main() {
	var a [0]byte // Empty array: [n]T
	var s []byte  // Nil slice: []T

	fmt.Println(a) // []
	fmt.Println(s) // []

	fmt.Println(reflect.TypeOf(a)) // [0]uint8 👈 [n]T
	fmt.Println(reflect.TypeOf(s)) // []uint8 👈 []T
}

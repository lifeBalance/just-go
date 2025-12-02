package main

import (
	"encoding/json"
	"fmt"
	"reflect"
)

func main() {
	var s []byte
	var a [0]byte

	fmt.Println(a)                 // []
	fmt.Println(reflect.TypeOf(a)) // [0]uint8 👈 Empty array

	fmt.Println(s)                 // []
	fmt.Println(reflect.TypeOf(s)) // []uint8 👈 Empty slice

	fmt.Println(s == nil)            // true
	jsonData, err := json.Marshal(s) // convert to json
	if err != nil {
		panic(err)
	}

	fmt.Println(string(jsonData)) // null
}

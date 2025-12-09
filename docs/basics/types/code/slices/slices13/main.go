package main

import (
	"encoding/json"
	"fmt"
)

func main() {
	var names []string
	names2 := []string{}

	namesJson, _ := json.Marshal(names)
	names2Json, _ := json.Marshal(names2)

	fmt.Println(len(names))  // 0
	fmt.Println(len(names2)) // 0

	fmt.Println(names)  // []
	fmt.Println(names2) // []

	fmt.Println(names == nil)  // true
	fmt.Println(names2 == nil) // false

	fmt.Println(string(namesJson))  // null
	fmt.Println(string(names2Json)) // []
}

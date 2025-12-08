package main

import (
	"fmt"
)

func main() {
	ages := map[string]int{
		"Alice": 30,
		"Bob":   25,
	}

	_, ok := ages["Alice"]
	fmt.Println(ok) // true
	_, ok = ages["Ralphie"]
	fmt.Println(ok) // false
}

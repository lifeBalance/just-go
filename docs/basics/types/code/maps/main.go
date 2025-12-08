package main

import "fmt"

func main() {
	var ages map[string]int // Declare

	fmt.Println(ages)        // map[]
	fmt.Println(ages == nil) // true

	ages = make(map[string]int) // Initialize
	fmt.Println(ages == nil)    // false
}

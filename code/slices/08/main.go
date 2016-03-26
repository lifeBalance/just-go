package main

import "fmt"

func main() {

	// Short syntax for creating slices
	fruits := []string{"Bananas", "Blueberries", "Raspberries"}

	for i, v := range fruits {
		fmt.Printf("%d. %v\n", i+1, v)
	}
}

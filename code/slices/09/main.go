package main

import "fmt"

func main() {

	fruits := []string{"Bananas", "Blueberries", "Raspberries"}

	for i := range fruits {
		fmt.Printf("%d. Fruit\n", i+1)
	}
}

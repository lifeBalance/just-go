package main

import "fmt"

func main() {

	fruits := []string{"Bananas", "Blueberries", "Raspberries"}

	for _, v := range fruits {
		fmt.Printf("* %v\n", v)
	}
}

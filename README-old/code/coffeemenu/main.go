package main

import (
	"fmt"
	"strconv"

	"github.com/eiannone/keyboard"
)

func main() {
	err := keyboard.Open()
	if err != nil {
		panic(err)
	}

	defer func() {
		_ = keyboard.Close() // Cleanup when the program is over
	}()

	coffees := map[int]string{
		1: "Capuccino",
		2: "Latte",
		3: "Americano",
	}

	fmt.Println("Cofee Menu")
	fmt.Println("----------")
	fmt.Println("1 - Capuccino")
	fmt.Println("2 - Latte")
	fmt.Println("3 - Americano")
	fmt.Println("Q - Quit the program")

	for {
		char, _, err := keyboard.GetKey()
		if err != nil {
			panic(err)
		}

		if char == 'q' || char == 'Q' {
			break
		}

		fmt.Println("You typed:", char)
		// Convert rune to string then to int
		intOption, _ := strconv.Atoi(string(char))
		// Use the int to print the name of the coffee (from the map)
		fmt.Println("You chose", coffees[intOption])
	}
}

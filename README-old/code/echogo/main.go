package main

import (
	"fmt"

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

	fmt.Println("Press ESC to quit")
	var line []rune
	newLine := true // Track when to print the prompt for a new line

	for {
		if newLine {
			fmt.Print("-> ")
			newLine = false
		}

		char, key, err := keyboard.GetKey()
		if err != nil {
			panic(err)
		}

		if key == keyboard.KeyEsc {
			return
		} else if key == keyboard.KeyEnter {
			fmt.Println()             // Move to next line
			fmt.Println(string(line)) // Print the line
			line = nil                // Clear the line
			newLine = true            // Prepare for next prompt
			continue
		} else if char != 0 {
			line = append(line, char) // Append the character to the line
			fmt.Printf("%c", char)    // Echo character
		}
	}
}

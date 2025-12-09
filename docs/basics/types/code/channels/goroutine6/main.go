package main

import (
	"fmt"

	"github.com/eiannone/keyboard"
)

func main() {
	keyPressChan := make(chan rune)

	go listenForKeyPress(keyPressChan)

	fmt.Println("Press any key (q to quit)")
	_ = keyboard.Open()
	defer func() {
		keyboard.Close()
	}()

	for {
		char, _, _ := keyboard.GetSingleKey()
		if char == 'q' || char == 'Q' {
			fmt.Println("Quitting!")
			break
		}
		keyPressChan <- char
	}
}

func listenForKeyPress(ch <-chan rune) {
	for {
		key, ok := <-ch
		if !ok {
			break
		}
		fmt.Println("You pressed", string(key))
	}
}

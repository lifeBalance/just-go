package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

var reader *bufio.Reader

type User struct {
	Name     string
	Age      int
	Height   float32
	OwnsADog bool
}

func main() {
	reader = bufio.NewReader(os.Stdin)

	var user User
	user.Name = readString("What's your name?")
	user.Age = readInt("How old are you?")
	user.Height = float32(readFloat("How tall are you?"))
	user.OwnsADog = readDog("Do you own a dog (y/n)?")
	fmt.Printf("Your name is %s and you are %d years old and %.1f units tall. Owns a dog: %t\n", user.Name, user.Age, user.Height, user.OwnsADog)

}

func prompt() {
	fmt.Print("-> ")
}

func readString(s string) string {
	for {
		fmt.Println(s)
		prompt()
		userInput, _ := reader.ReadString('\n')
		userInput = clearNewlines(userInput)
		if userInput == "" {
			fmt.Println("Please enter a string")
		} else {
			return userInput
		}

	}
}

func readInt(s string) int {
	for {
		userInput := readString(s)
		num, err := strconv.Atoi(userInput)
		if err != nil {
			fmt.Println("Please enter a whole number")
		} else {
			return num
		}
	}
}

func readFloat(s string) float64 {
	for {
		userInput := readString(s)
		num, err := strconv.ParseFloat(userInput, 32)
		if err != nil {
			fmt.Println("Please enter a number")
		} else {
			return num
		}
	}
}

func readDog(s string) bool {
	for {
		userInput := readString(s)
		if userInput == "y" {
			return true
		} else if userInput == "n" {
			return false
		} else {
			fmt.Println("Please enter y (for yes) or n (for no)")
		}
	}
}

func clearNewlines(s string) string {
	s = strings.ReplaceAll(s, "\r\n", "")
	s = strings.ReplaceAll(s, "\n", "")
	return s
}

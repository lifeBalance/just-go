package main

import "fmt"

func main() {
	personName := getUserName()
	greetUser(personName)
}

func getUserName() string {
	var whom string
	fmt.Print("Enter your name: ")
	fmt.Scan(&whom)
	return whom
}

func greetUser(whom string) {
	fmt.Println("Hello,", whom+"!")
}

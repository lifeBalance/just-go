package utils

import "fmt"

func GetUserName() string {
	var whom string
	fmt.Print("Enter your name: ")
	fmt.Scan(&whom)
	return whom
}

func GreetUser(whom string) {
	fmt.Println("Hello,", whom+"!")
}

package main

import (
	"fmt"
	"strings"

	cowsay "github.com/Code-Hex/Neo-cowsay/v2"
)

func GetUserName() string {
	var whom string
	fmt.Print("Enter your name: ")
	fmt.Scan(&whom)
	return whom
}

func GreetUser(whom string) {
	msg := strings.Join([]string{"Hello", whom, "!"}, " ")
	say, err := cowsay.Say(msg)
	if err != nil {
		panic(err)
	}
	fmt.Println(say)
}

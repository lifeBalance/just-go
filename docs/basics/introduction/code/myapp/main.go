package main

import (
	"myapp/lib"
	"myapp/utils"
)

func main() {
	lib.GreetUser("Bob")   // Bonjour, Bob!
	utils.GreetUser("Bob") // Hello, Bob!
}

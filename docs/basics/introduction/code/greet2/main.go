package main

import "greet2/utils"

func main() {
	personName := utils.GetUserName()
	utils.GreetUser(personName)
}

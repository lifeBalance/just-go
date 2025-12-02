package main

import "greet3/utils"

func main() {
	personName := utils.GetUserName()
	utils.GreetUser(personName)
}

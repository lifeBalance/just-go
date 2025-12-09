package main

import (
	"fmt"
)

func main() {
	go printSomething("something")
}

func printSomething(theThing string) {
	fmt.Println(theThing)
}

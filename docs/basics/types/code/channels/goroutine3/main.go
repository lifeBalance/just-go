package main

import (
	"fmt"
	"time"
)

func main() {
	go printSomething("something")
	time.Sleep(10 * time.Millisecond) // Forces scheduler ticks
}

func printSomething(theThing string) {
	fmt.Println(theThing)
}

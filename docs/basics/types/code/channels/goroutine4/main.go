package main

import (
	"fmt"
	"sync"
)

func main() {
	var wg sync.WaitGroup
	wg.Add(1) // Increment counter for one goroutine

	go func() {
		defer wg.Done() // Decrement on exit
		printSomething("something")
	}()

	wg.Wait() // Block until counter is zero
}

func printSomething(theThing string) {
	fmt.Println(theThing)
}

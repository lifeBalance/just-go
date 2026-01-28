package main

import (
	"fmt"
	"sync"
)

func main() {
	money := 100
	var wg sync.WaitGroup

	wg.Add(2) // We're launching 2 goroutines

	go deposit(&money, &wg)
	go withdraw(&money, &wg)

	wg.Wait() // Wait for both goroutines to finish

	fmt.Printf("Balance: %d\n", money)
}

func deposit(money *int, wg *sync.WaitGroup) {
	defer wg.Done() // Signal completion when function returns
	for range 1_000_000 {
		*money += 10
	}
}

func withdraw(money *int, wg *sync.WaitGroup) {
	defer wg.Done() // Signal completion when function returns
	for range 1_000_000 {
		*money -= 10
	}
}

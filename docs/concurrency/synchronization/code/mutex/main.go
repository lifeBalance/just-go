package main

import (
	"fmt"
	"sync"
)

func main() {
	money := 100
	var wg sync.WaitGroup
	var mu sync.Mutex // Create a mutex

	wg.Add(2)

	go deposit(&money, &mu, &wg)
	go withdraw(&money, &mu, &wg)

	wg.Wait()

	fmt.Printf("Balance: %d\n", money)
}

func deposit(money *int, mu *sync.Mutex, wg *sync.WaitGroup) {
	defer wg.Done()

	for range 1_000_000 {
		mu.Lock()    // Acquire the lock
		*money += 10 // Critical section
		mu.Unlock()  // Release the lock
	}
}

func withdraw(money *int, mu *sync.Mutex, wg *sync.WaitGroup) {
	defer wg.Done()

	for range 1_000_000 {
		mu.Lock()    // Acquire the lock
		*money -= 10 // Critical section
		mu.Unlock()  // Release the lock
	}
}

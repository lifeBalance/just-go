package main

import (
	"fmt"
	"sync"
	"time"
)

func main() {
	money := 100
	var mu sync.Mutex
	var wg sync.WaitGroup // Create a wait group variable.
	wg.Add(2)             // Set wait group counter to 2.

	go func() {
		defer wg.Done()
		deposit(&money, &mu)
	}()

	go func() {
		defer wg.Done()
		go withdraw(&money, &mu)
	}()

	wg.Wait()

	mu.Lock()
	fmt.Printf("Balance: %d\n", money)
	mu.Unlock()
}

func deposit(money *int, mu *sync.Mutex) {
	for range 1_000_000 {
		mu.Lock()
		time.Sleep(2 * time.Microsecond) // Simulate slow I/O operation

		*money += 10
		mu.Unlock()
	}
}

func withdraw(money *int, mu *sync.Mutex) {
	for range 1_000_000 {
		mu.Lock()
		time.Sleep(2 * time.Microsecond) // Simulate slow I/O operation

		*money -= 10
		mu.Unlock()
	}
}

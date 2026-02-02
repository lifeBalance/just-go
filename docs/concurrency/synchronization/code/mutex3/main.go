package main

import (
	"fmt"
	"sync"
	"time"
)

func main() {
	money := 100
	var mu sync.Mutex
	var wg sync.WaitGroup
	wg.Add(2)

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
		// Slow operation BEFORE critical section
		time.Sleep(2 * time.Microsecond) // Simulate slow I/O operation

		// CRITICAL SECTION: Only this part should be protected by mutex
		mu.Lock()    // Acquire the lock
		*money += 10 // Critical section - only this needs protection
		mu.Unlock()  // Release the lock
	}
}

func withdraw(money *int, mu *sync.Mutex) {
	for range 1_000_000 {
		// Slow operation BEFORE critical section
		time.Sleep(2 * time.Microsecond) // Simulate slow I/O operation

		// CRITICAL SECTION: Only this part should be protected by mutex
		mu.Lock()    // Acquire the lock
		*money -= 10 // Critical section - only this needs protection
		mu.Unlock()  // Release the lock
	}
}

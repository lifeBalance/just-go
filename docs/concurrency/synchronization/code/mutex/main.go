package main

import (
	"fmt"
	"sync"
	"time"
)

func main() {
	money := 100
	var mu sync.Mutex // Create a mutex

	go deposit(&money, &mu)
	go withdraw(&money, &mu)

	time.Sleep(2 * time.Second) // ⚠️ temporary hack

	fmt.Printf("Balance: %d\n", money)
}

func deposit(money *int, mu *sync.Mutex) {
	for range 1_000_000 {
		mu.Lock()    // Acquire the lock
		*money += 10 // Critical section
		mu.Unlock()  // Release the lock
	}
}

func withdraw(money *int, mu *sync.Mutex) {
	for range 1_000_000 {
		mu.Lock()    // Acquire the lock
		*money -= 10 // Critical section
		mu.Unlock()  // Release the lock
	}
}

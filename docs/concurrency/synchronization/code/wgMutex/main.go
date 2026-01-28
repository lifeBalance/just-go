package main

import (
	"fmt"
	"sync"
)

func main() {
	money := 100
	var mu sync.Mutex
	var wg sync.WaitGroup

	wg.Add(2)
	go deposit(&money, &mu, &wg)
	go withdraw(&money, &mu, &wg)
	wg.Wait()

	fmt.Printf("Balance: %d\n", money) // Always 100
}

func deposit(money *int, mu *sync.Mutex, wg *sync.WaitGroup) {
	defer wg.Done()
	for range 1_000_000 {
		mu.Lock()
		*money += 10
		mu.Unlock()
	}
}

func withdraw(money *int, mu *sync.Mutex, wg *sync.WaitGroup) {
	defer wg.Done()
	for range 1_000_000 {
		mu.Lock()
		*money -= 10
		mu.Unlock()
	}
}

package main

import (
	"fmt"
	"sync"
)

func main() {
	money := 100
	var mu sync.Mutex
	done := make(chan struct{})
	var wg sync.WaitGroup

	wg.Add(2)

	go func() {
		defer wg.Done()
		for i := 0; i < 1_000_000; i++ {
			mu.Lock()
			money += 10
			mu.Unlock()
		}
	}()

	go func() {
		defer wg.Done()
		for i := 0; i < 1_000_000; i++ {
			mu.Lock()
			money -= 10
			mu.Unlock()
		}
	}()

	go func() {
		wg.Wait()
		close(done)
	}()

	<-done
	fmt.Printf("Balance: %d\n", money)
}

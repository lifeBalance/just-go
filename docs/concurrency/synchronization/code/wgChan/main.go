package main

import (
	"fmt"
	"sync"
)

func main() {
	ops := make(chan int)
	var wg sync.WaitGroup

	wg.Add(2)

	// Balance owner
	go func() {
		balance := 100
		for delta := range ops {
			balance += delta
		}
		fmt.Printf("Balance: %d\n", balance)
	}()

	go func() {
		defer wg.Done()
		deposit(ops)
	}()

	go func() {
		defer wg.Done()
		withdraw(ops)
	}()

	wg.Wait()
	close(ops)
}

func deposit(ops chan<- int) {
	for i := 0; i < 1_000_000; i++ {
		ops <- 10
	}
}

func withdraw(ops chan<- int) {
	for i := 0; i < 1_000_000; i++ {
		ops <- -10
	}
}

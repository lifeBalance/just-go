package main

import (
	"fmt"
)

func main() {
	ops := make(chan int)
	done := make(chan struct{})

	// Single goroutine owns the balance
	go func() {
		balance := 100
		for delta := range ops {
			balance += delta
		}
		fmt.Printf("Balance: %d\n", balance)
		close(done)
	}()

	go deposit(ops)
	go withdraw(ops)

	// Wait for workers to finish, then close ops
	go func() {
		depositDone := make(chan struct{})
		withdrawDone := make(chan struct{})

		go func() {
			deposit(ops)
			close(depositDone)
		}()
		go func() {
			withdraw(ops)
			close(withdrawDone)
		}()

		<-depositDone
		<-withdrawDone
		close(ops)
	}()

	<-done
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

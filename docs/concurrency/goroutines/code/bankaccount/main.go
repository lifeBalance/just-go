package main

import (
	"fmt"
	"time"
)

func main() {
	money := 100

	go deposit(&money)
	go withdraw(&money)

	time.Sleep(2 * time.Second) // ⚠️ temporary hack

	fmt.Printf("Balance: %d\n", money)
}

func deposit(money *int) {
	for range 1_000_000 {
		*money += 10
	}
}

func withdraw(money *int) {
	for range 1_000_000 {
		*money -= 10
	}
}

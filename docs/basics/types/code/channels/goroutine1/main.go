package main

import (
	"fmt"
	"time"
)

func main() {
	// Regular function call - blocks execution
	printNumbers("sequential")

	// Goroutine - runs concurrently
	go printNumbers("goroutine-1")
	go printNumbers("goroutine-2")

	// Give goroutines time to finish
	time.Sleep(2 * time.Second)
	fmt.Println("Done!")
}

func printNumbers(label string) {
	for i := 1; i <= 3; i++ {
		fmt.Printf("%s: %d\n", label, i)
		time.Sleep(500 * time.Millisecond)
	}
}

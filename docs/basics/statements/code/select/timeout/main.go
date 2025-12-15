package main

import (
	"fmt"
	"time"
)

func main() {
	ch := make(chan string)

	go slowTask(ch)

	select {
	case result := <-ch:
		fmt.Println("Got result:", result)
	case <-time.After(1 * time.Second):
		fmt.Println("Timeout! Task took too long") // ✅ This executes 🐌
	}
}

func slowTask(ch chan string) {
	time.Sleep(2 * time.Second) // 😴 Takes 2 seconds
	ch <- "task completed"
}

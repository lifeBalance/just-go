package main

import (
	"fmt"
	"time"
)

func main() {
	start := time.Now()
	for i := range 5 {
		go doWork(i) // 🚀 Launch goroutine
	}
	time.Sleep(2 * time.Second) // 😬 Gross hack - just wait
	end := time.Now()
	fmt.Printf("Main function took %s\n", end.Sub(start))
}

func doWork(id int) {
	start := time.Now().Format("15:04:05") // magic reference time
	fmt.Printf("Work %d started at %s\n", id, start)

	time.Sleep(1 * time.Second)

	end := time.Now().Format("15:04:05") // magic reference time
	sep := "--------------------------"  // separator
	fmt.Printf("Work %d finished at %s\n%s\n", id, end, sep)
}

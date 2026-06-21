package main

import (
	"fmt"
	"time"
)

func main() {
	go worker(1)
	go worker(2)
	go worker(3)

	fmt.Println("All workers done")
}

func worker(id int) {
	fmt.Printf("Worker %d starting\n", id)
	time.Sleep(1 * time.Second)
	fmt.Printf("Worker %d done\n", id)
}

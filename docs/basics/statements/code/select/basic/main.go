package main

import (
	"fmt"
	"time"
)

func main() {
	ch1 := make(chan string)
	ch2 := make(chan string)

	go task1(ch1)
	go task2(ch2)

	// Wait for whichever channel is ready first
	select {
	case msg1 := <-ch1:
		fmt.Println(msg1) // ✅ from channel 1 (arrives first)
	case msg2 := <-ch2:
		fmt.Println(msg2)
	}
}

func task1(ch chan string) {
	time.Sleep(1 * time.Second)
	ch <- "task 1 done!"
}

func task2(ch chan string) {
	time.Sleep(2 * time.Second) // 😴 Longer sleep
	ch <- "task 2 done!"
}

package main

import (
	"fmt"
	"time"
)

func main() {
	ch := make(chan struct{}) // create channel

	go greet(ch)

	<-ch // Wait for completion signal
}

func greet(ch chan struct{}) {
	time.Sleep(1 * time.Second)
	fmt.Println("Hello world!")
	close(ch) // Send completion signal
}

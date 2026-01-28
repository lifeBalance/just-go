package main

import (
	"fmt"
	"time"
)

func main() {
	go greet()
}

func greet() {
	time.Sleep(1 * time.Second)
	fmt.Println("Hello world!")
}

package main

import (
	"fmt"
)

func main() {
	done1 := make(chan struct{})

	go func() { printSomething("something"); close(done1) }()

	<-done1
}

func printSomething(theThing string) {
	fmt.Println(theThing)
}

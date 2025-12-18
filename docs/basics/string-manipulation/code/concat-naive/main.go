package main

import (
	"fmt"
	"time"
)

func main() {
	const N = 100000 // adjust for your machine

	start := time.Now()
	s := ""
	for i := 0; i < N; i++ {
		s += "x"
	}
	elapsed := time.Since(start)

	fmt.Printf("naive: len=%d time=%s\n", len(s), elapsed)
}

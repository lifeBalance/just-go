package main

import (
	"fmt"
	"strings"
	"time"
)

func main() {
	const N = 100000 // adjust for your machine

	start := time.Now()
	var b strings.Builder
	b.Grow(N) // optional pre-grow to avoid a few resizes
	for i := 0; i < N; i++ {
		b.WriteByte('x')
	}
	s := b.String()
	elapsed := time.Since(start)

	fmt.Printf("builder: len=%d time=%s\n", len(s), elapsed)
}

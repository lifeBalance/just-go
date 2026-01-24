package main

import (
	"fmt"
	"math/rand"
	"strings"
	"time"
)

const allLetters = "abcdefghijklmnopqrstuvwxyz"

var sampleTexts = []string{
	"Concurrency requires thinking about interactions between independent processes and data flow models.",
	"Synchronization ensures that shared resources remain consistent even under highly parallel workloads and stress.",
	"Designing responsive programs involves isolating slow operations while coordinating work smoothly across goroutines.",
}

func main() {
	frequency := make([]int, 26)
	for _, text := range sampleTexts {
		randomInt := 500 + rand.Intn(1001) // range 500-1500 inclusive
		randomDelay := time.Duration(randomInt) * time.Millisecond
		go countLetters(text, randomDelay, frequency)
	}
	time.Sleep(3 * time.Second) // ⚠️ temporary hack
	for i, c := range allLetters {
		if i > 0 && i%9 == 0 {
			fmt.Printf("%c-%d\n", c, frequency[i])
		} else {
			fmt.Printf("%c-%d ", c, frequency[i])
		}
	}
	fmt.Println()
}

func countLetters(text string, delay time.Duration, frequency []int) {
	// time.Sleep(delay) // artificially slow

	for _, r := range text {
		c := strings.ToLower(string(r))
		idx := strings.Index(allLetters, c)
		if idx >= 0 {
			frequency[idx]++
		}
	}
	fmt.Println("Completed sample of length:", len(text))
}

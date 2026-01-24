package main

import (
	"sync"
	"testing"
	"time"
)

func TestCountLettersRace(t *testing.T) {
	frequency := make([]int, len(allLetters))
	var wg sync.WaitGroup
	for i := 0; i < 100; i++ {
		for _, text := range sampleTexts {
			wg.Add(1)
			go func(text string) {
				defer wg.Done()
				countLetters(text, 0, frequency) // shared slice triggers race
			}(text)
		}
	}
	done := make(chan struct{})
	go func() {
		wg.Wait()
		close(done)
	}()
	select {
	case <-done:
	case <-time.After(3 * time.Second):
		t.Fatal("goroutines did not finish")
	}
}

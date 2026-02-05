package main

import (
	"fmt"
	"sync"
	"time"
)

const (
	numReaders          = 100
	numWriters          = 1
	readsPerReader      = 1000
	writesPerWriter     = 100
	singleWriteDuration = 1 * time.Millisecond
	singleReadDuration  = 50 * time.Microsecond
)

type Data struct {
	data        string
	totalWrites int
}

func main() {
	mutex := sync.Mutex{}
	data := Data{data: "initial data", totalWrites: 0}
	start := time.Now()

	var wg sync.WaitGroup

	// Writers
	for range numWriters {
		for range writesPerWriter {
			wg.Go(func() {
				writer(&data, &mutex)
			})
		}
	}

	// Readers
	for range numReaders {
		for range readsPerReader {
			wg.Go(func() {
				reader(&data, &mutex)
			})
		}
	}

	wg.Wait()
	printBenchmark("Standard Mutex", &data, time.Since(start))
}

func writer(data *Data, mutex *sync.Mutex) {
	mutex.Lock()
	data.data = "some data"         // Update the shared data
	data.totalWrites++              // Track that we did a write (also update)
	time.Sleep(singleWriteDuration) // Simulating real work 😴
	mutex.Unlock()
}

func reader(data *Data, mutex *sync.Mutex) {
	mutex.Lock()
	_ = data.data                  // Read the shared data
	time.Sleep(singleReadDuration) // Simulating real work 😴
	mutex.Unlock()
}

func printBenchmark(name string, data *Data, duration time.Duration) {
	expectedWrites := numWriters * writesPerWriter
	expectedReads := numReaders * readsPerReader

	fmt.Printf("%s:\n", name)

	status := ""
	if data.totalWrites == expectedWrites {
		status = "✅"
	} else {
		status = "❌"
	}
	fmt.Printf(
		"  Total writes: %d (expected: %d) %s\n",
		data.totalWrites,
		expectedWrites,
		status,
	)

	fmt.Printf(
		"  Expected reads: %d ✅\n",
		expectedReads,
	)
	fmt.Printf("  Time: %v\n", duration)
}

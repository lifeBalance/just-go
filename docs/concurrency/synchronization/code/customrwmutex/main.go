package main

import (
	"fmt"
	"sync"
	"time"
)

const (
	numReaders          = 100
	numWriters          = 2
	readsPerReader      = 1000
	writesPerWriter     = 10
	singleReadDuration  = 50 * time.Microsecond
	singleWriteDuration = 5 * time.Millisecond
)

type Data struct {
	value       int
	totalWrites int
}

type ReadWriteMutex struct {
	readersCounter int        // number of active readers
	readersLock    sync.Mutex // protects readersCounter
	globalLock     sync.Mutex // blocks writers (and first reader)
}

func (rw *ReadWriteMutex) ReadLock() {
	rw.readersLock.Lock()
	rw.readersCounter++
	if rw.readersCounter == 1 {
		rw.globalLock.Lock()
	}
	rw.readersLock.Unlock()
}

func (rw *ReadWriteMutex) WriteLock() {
	rw.globalLock.Lock()
}

func (rw *ReadWriteMutex) ReadUnlock() {
	rw.readersLock.Lock()
	rw.readersCounter--
	if rw.readersCounter == 0 {
		rw.globalLock.Unlock()
	}
	rw.readersLock.Unlock()
}

func (rw *ReadWriteMutex) WriteUnlock() {
	rw.globalLock.Unlock()
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

func main() {
	var (
		rw   ReadWriteMutex
		data Data
		wg   sync.WaitGroup
	)

	start := time.Now()

	// Writers
	for range numWriters {
		for range writesPerWriter {
			wg.Go(func() {
				rw.WriteLock()
				data.value++
				data.totalWrites++
				time.Sleep(singleWriteDuration)
				rw.WriteUnlock()
			})
		}
	}

	// Readers
	for range numReaders {
		for range readsPerReader {
			wg.Go(func() {
				rw.ReadLock()
				_ = data.value                 // Simulate reading data
				time.Sleep(singleReadDuration) // Simulate work 😴
				rw.ReadUnlock()
			})
		}
	}

	wg.Wait()
	printBenchmark("Reader-priority RW mutex", &data, time.Since(start))
}

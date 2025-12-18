package main

import (
	"fmt"
	"strings"
)

// removeNth removes the nth occurrence of needle from s (1-indexed)
// Example: removeNth("banana", "a", 2) → "bana" (removes second 'a')
func removeNth(s, needle string, position int) string {
	// Early exit: Invalid inputs? Do nothing.
	if position <= 0 || needle == "" {
		return s
	}

	occurrenceCount := 0 // How many needles we've found so far
	searchStart := 0     // Where to begin the next search (starts at beginning)

	// Keep searching until we've scanned the whole string
	for searchStart < len(s) {
		// Find the offset to the next needle from searchStart
		// strings.Index returns -1 if not found in s[searchStart:]
		offset := strings.Index(s[searchStart:], needle)
		if offset == -1 {
			return s // No more needles—stop, no change
		}

		// We've found another one!
		occurrenceCount++
		needleStartingIndex := searchStart + offset // Absolute position in full s

		// Is this the one we want to remove?
		if occurrenceCount == position {
			// Slice: everything before needle + everything after needle
			// (Go strings are immutable, so + creates a new one)
			return s[:needleStartingIndex] + s[needleStartingIndex+len(needle):]
		}

		// Not yet, so move past the current needle for the next search
		searchStart = needleStartingIndex + len(needle)
	}

	// If we exit loop without hitting position, no change
	return s
}

func main() {
	s := "hello, 🤖! hello again, hello world"

	fmt.Println(removeNth(s, "hello", 1)) // , 🤖! hello again, hello world
	fmt.Println(removeNth(s, "hello", 2)) // hello, 🤖!  again, hello world
	fmt.Println(removeNth(s, "hello", 3)) // hello, 🤖! hello again,  world
	fmt.Println(removeNth(s, "hello", 4)) // hello, 🤖! hello again, hello world
}

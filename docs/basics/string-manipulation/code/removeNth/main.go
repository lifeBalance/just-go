package main

import (
	"fmt"
	"strings"
)

// removeNth removes the nth occurrence of needle from s (1-indexed)
func removeNth(s, needle string, position int) string {
	if position <= 0 || needle == "" {
		return s
	}

	count := 0
	index := 0

	for index < len(s) {
		i := strings.Index(s[index:], needle)
		if i == -1 {
			return s // position not found
		}

		count++
		actualIndex := index + i

		if count == position {
			return s[:actualIndex] + s[actualIndex+len(needle):]
		}

		index = actualIndex + len(needle)
	}

	return s
}

func main() {
	s := "hello, 🤖! hello again, hello world"

	fmt.Println(removeNth(s, "hello", 1)) // , 🤖! hello again, hello world
	fmt.Println(removeNth(s, "hello", 2)) // hello, 🤖!  again, hello world
	fmt.Println(removeNth(s, "hello", 3)) // hello, 🤖! hello again,  world
	fmt.Println(removeNth(s, "hello", 4)) // hello, 🤖! hello again, hello world
}

package main

import "fmt"

func main() {
	s := "Café 😀"
	for i := 0; i < len(s); i++ {
		fmt.Printf("%d: %q\n", i, s[i])
	}
}

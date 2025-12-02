package main

import (
	"fmt"
)

func main() {
	names := []string{} // Empty slice

	names = append(names, "Bob")
	names = append(names, "Lisa")
	names = append(names, "Frankie")

	fmt.Println(names)      // [Bob Lisa Frankie]
	fmt.Println(len(names)) // 3
}

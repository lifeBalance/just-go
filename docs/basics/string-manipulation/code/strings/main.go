package main

import "fmt"

func main() {
	var greeting string = "Hi!"

	fmt.Println("Char | Dec | Hex   | Binary     | Unicode")
	fmt.Println("-----+-----+-------+------------+---------")

	for i := 0; i < len(greeting); i++ {
		char := greeting[i]
		fmt.Printf("  %c  | %3d | 0x%02x  | 0b%08b | U+%04X\n",
			char, char, char, char, char)
	}
}

package main

import "fmt"

func addNumbers(nums ...int) int {
	total := 0

	for _, n := range nums {
		total += n
	}

	return total
}

func main() {
	result := addNumbers(2, 3, 7)
	fmt.Println(result) // 12
}

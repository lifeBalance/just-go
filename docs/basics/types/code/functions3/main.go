package main

import "fmt"

func applyOperation(a, b int, op func(int, int) int) int {
	return op(a, b)
}

func main() {
	add := func(x, y int) int { return x + y }
	multiply := func(x, y int) int { return x * y }

	fmt.Println(applyOperation(5, 3, add))      // 8
	fmt.Println(applyOperation(5, 3, multiply)) // 15
}

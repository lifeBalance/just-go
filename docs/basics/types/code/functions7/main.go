package main

import "fmt"

func main() {
	// 1. Anonymous function assigned to a variable
	greet := func(name string) {
		fmt.Println("Hello,", name)
	}
	greet("Alice") // Hello, Alice

	// 2. Anonymous function executed immediately (IIFE - Immediately Invoked Function Expression)
	func(message string) {
		fmt.Println(message)
	}("This runs right away!") // This runs right away!

	// 3. Anonymous function with return value
	add := func(a, b int) int {
		return a + b
	}
	result := add(5, 3)
	fmt.Println("Sum:", result) // Sum: 8

	// 4. Anonymous function in a loop
	numbers := []int{1, 2, 3, 4, 5}
	double := func(n int) int {
		return n * 2
	}

	for _, num := range numbers {
		fmt.Println(double(num)) // 2, 4, 6, 8, 10
	}

	// 5. Multiple anonymous functions
	var operation func(int, int) int

	operation = func(a, b int) int { return a + b }
	fmt.Println(operation(10, 5)) // 15

	operation = func(a, b int) int { return a * b }
	fmt.Println(operation(10, 5)) // 50
}

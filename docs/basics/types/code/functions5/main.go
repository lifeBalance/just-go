package main

import "fmt"

func addNumbers(a int, b int) (sum int) {
	sum = a + b
	return
}

func main() {
	result := addNumbers(2, 3)
	fmt.Println(result) // 5
}

package main

import (
	"errors"
	"fmt"
)

func divideTwoNumbers(a, b float64) (float64, error) {
	if b == 0 {
		return 0, errors.New("cannot divide by zero")
	}
	return a / b, nil
}

func main() {
	result, err := divideTwoNumbers(4, 0)

	if err != nil {
		fmt.Println("error:", err) // ⚠️ error: cannot divide by zero
		return                     // 👈 early return on error
	}

	fmt.Println(result)
}

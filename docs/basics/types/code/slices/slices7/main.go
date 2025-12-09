package main

import (
	"fmt"
)

func main() {
	ages := make([]byte, 5)

	fmt.Println(len(ages)) // 5
	fmt.Println(cap(ages)) // 5
	fmt.Println(ages)      // [0 0 0 0 0]
}

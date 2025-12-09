package main

import "fmt"

func main() {
	var names []string

	names = append(names, "Bob")
	names = append(names, "Lisa")
	names = append(names, "Ralphie")

	fmt.Println(names)      // ["Bob" "Lisa" "Ralphie"]
	fmt.Println(len(names)) // 3
}

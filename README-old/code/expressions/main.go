package main

import "fmt"

func main() {
	bob := struct {
		name string
		age  int
	}{
		name: "Robert",
		age:  42,
	}
	fmt.Println(bob.name)
}

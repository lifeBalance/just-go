package main

import "fmt"

type person struct {
	name string
	age  int
}

func main() {
	var someDude any = person{name: "bob", age: 42}
	var aString string
	var anInteger int

	p, ok := someDude.(person)

	if ok {
		aString = p.name
		anInteger = p.age
		fmt.Println(aString, anInteger) // bob 42
	} else {
		fmt.Println("foo is not a person")
	}
}

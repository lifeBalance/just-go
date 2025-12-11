package main

import "fmt"

type Animal struct{}

func (a Animal) Speak() {
	fmt.Println("Some generic sound")
}

type Dog struct {
	Animal
}

// Dog's own Speak method takes precedence
func (d Dog) Speak() {
	fmt.Println("Woof!")
}

func main() {
	dog := Dog{}
	dog.Speak()        // Woof!
	dog.Animal.Speak() // Some generic sound
}

package main

import "fmt"

type User struct {
	name      string
	age       int
	formatter func(User) string
}

func main() {
	// Create a user with a function assigned to the field
	user := User{
		name: "Alice",
		age:  30,
		formatter: func(u User) string {
			return fmt.Sprintf("%s is %d years old", u.name, u.age)
		},
	}

	fmt.Println(user.formatter(user)) // Alice is 30 years old

	// Change the formatter function
	user.formatter = func(u User) string {
		return fmt.Sprintf("Name: %s, Age: %d", u.name, u.age)
	}

	fmt.Println(user.formatter(user)) // Name: Alice, Age: 30

	// Another user with a different formatter
	user2 := User{
		name: "Bob",
		age:  25,
		formatter: func(u User) string {
			return fmt.Sprintf("%s (%d)", u.name, u.age)
		},
	}

	fmt.Println(user2.formatter(user2)) // Bob (25)
}

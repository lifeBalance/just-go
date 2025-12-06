# String Interpolation

Imagine we have this program:

```go
package main

import "fmt"

func main() {
	name := "Bob"
	age := 42
    fmt.Println("Your name is", name, "and you are", age "years old")
}
```

Passing a lot of arguments to `Prinln` is unefficient, it'd be better if we used **string concatenation**:

```go
fmt.Prinln("Your name is" + name + "and you are" + age + "years old")
```

But since `age` is an `int`, we can't use the `+` (it only accepts strings as operands). A way to solve this is to use [Printf](https://pkg.go.dev/fmt#example-Printf), which writes to **stdout** using format specifiers:

```go
fmt.Printf("Your name is %s and you are %d years old\n", userInput, age)
```

<Admonition>
String interpolation
</Admonition>

In case we didn't want to write to stdout, there's also [Sprintf](https://pkg.go.dev/fmt#Sprintf), which returns a string that we can store the string for later use:

```go
str := Sprintf("Your name is %s and you are %d years old\n", userInput, age)

fmt.Prinln(str)
```

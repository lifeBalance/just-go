# Variables
A [variable][1] is a name assigned to some space in our computer’s memory where a value is stored.

## Names
We can name our variables whatever we want, respecting some basic rules:

* We can use any combination of letter, digits and the `_` character.
* We cannot use Go [keywords][2] or [predeclared identifiers][3].
* The **first character** in our identifier can not be a number.
* Names are **case-sensitive**.

> The underscore character (`_`) by itself is a special identifier called the **blank identifier**. This identifier can be assigned any type of value, but its value is discarded so it cannot be used anymore in the code that follows.

## Types
As the name variable implies, a variable can hold different values during its lifetime, but being Go a **statically typed language**, the set of values that a variable may take is restricted by the [type][4] of the variable.

> The type of a variable determines the set of values it can store.

The type of a variable can be assigned manually by us, or automatically inferred.

## Declarations
A [variable declaration][5] is a **statement** that creates a variable of a particular type, and at the same time sets its initial value. A variable declarations has the following general form:
```
var name type = expression
```

Either the `type` or the `= expression` part may be omitted, but not both. Let's see a couple of examples:

1. Omitting the `type`:
  ```Go
  var num = 3
  ```

  In this case we are initializing a variable named `num` at the time of declaration, omitting its type. The compiler will infer it from the value we are assigning to it.

2. Omitting the `= expression`:
  ```Go
  var num int
  ```

  In this case we are omitting the expression, so the initial value is the **zero value** for the type which is:
    * `0` for numbers.
    * `''` for strings.
    * `false` for booleans.
    * `nil` for [interfaces][6] and reference types(slice, pointer, map, channel, function).
   The **zero-value mechanism** ensures that a variable always holds a value according to its type: in Go there is no such thing as an uninitialized variable.

Of course, we always have the option of being explicit about the variable's type when declaring it, for example:
```Go
var num int = 3
```

But in practice, most of the times we're gonna use the first two ways of declaring variables.

## Factoring variable Declarations
Sometimes we have to declare a bunch of variables, having to repeat the `var` keyword gets old very quickly. It’s much more clean if we factor the declarations under one `var` keyword:
```Go
var (
    message string
    num int
    answer bool
    Θ float32
)
```

The same as import statements, variable declarations may be “factored” into blocks. Also when we are declaring multiple variables that share the same type, we can group them in one line:
```Go
var (
    message, question string
    num int
    answer bool
    Θ float32
)
```

## Scopes
Go is lexically scoped, so variables have different scopes depending on the part of the source code where they are declared. A variable declared at the package level(outside any function) will have **package scope**, meaning it will be visible for all the code inside the package.

One of the key ideas in writing good code is the **principle of minimum scope**. This means that the scope of a variable (the lexical region where it is valid) should be as small as possible for the variable’s lifetime. One corollary of this principle is that variables should be declared immediately before their first use, so most of the times we are gonna define our variables inside functions, where they are effectively being used. When inside a function we have available a **short syntax** for variable declarations.

## Short Variable Declarations
Within a function, we can use a syntax known as [short variable declaration][7] to declare and initialize **local variables**. This syntax uses the `:=` initialization operator. Using this notation, you can declare and initialize a variable in a single statement without having to use:

* The `var` keyword.
* The **type** of the variables. It is inferred from the assignment.

For example:
```Go
func main() {
    message := "Hello world!"
    fmt.Println(message)
}
```

If we use the short syntax we can’t use the `var` keyword or specify the **type** of a variable, doing so will raise an **error**. But as we'll see later, there are several [numeric types][8], what if we want to specify a concrete type. We can do so using a **type casting expression**, for example:
```Go
func main() {
    pi := float32(3.14)
    fmt.Println(pi)
}
```

## Tuple assignments
Once a variable has been declared, its value can be reassigned as long as we respect its type. An interesting feature in Go is the ability to assign several values at the same time, for example:
```Go
a, b = 3, 4
```

Above we have used a comma separated list of values (tuple) for the assignment on both sides of the assignment operator. This feature can be used for swapping values:
```Go
a, b = b, a
```

We can also use an expression that evaluates to multiple values on the right side of the `=`, for example a function that return two or more values:
```Go
x, y = foo()
```

The number of operands on the left hand side must match the number of values returned by the expression. Sometimes that's not the case, and there are some situations where we are interested only in some of the values. For example, if `foo()` returns two values but we are interested only in the first one we would do:
```Go
x = foo()
```

But what when we are interested in the second value, but not in the first one? We know that in Go unused variables generate a compilation error, we need a way to get to the second value while at the same time discarding the first one. That's what the [blank identifier][9] is for. For example:
```Go
_, y = foo()
```

But **tuple assignments** are not only for declared variables. It's pretty common to combine them with **short variable declarations**, for example:
```Go
_, y := foo()
```

Or in standard variable declarations, no problem:
```Go
var i, j, k = 11, "hello", true
```


---
[:arrow_backward:][back] ║ [:house:][home] ║ [:arrow_forward:][next]

<!-- navigation -->
[home]: ../README.md
[back]: lexical_elements.md
[next]: #


<!-- links -->
[1]: https://golang.org/ref/spec#Variables
[2]: https://golang.org/ref/spec#Keywords
[3]: https://golang.org/ref/spec#Predeclared_identifiers
[4]: https://golang.org/ref/spec#Types
[5]: https://golang.org/ref/spec#Variable_declarations
[6]: https://golang.org/ref/spec#Interface_types
[7]: https://golang.org/ref/spec#Short_variable_declarations
[8]: https://golang.org/ref/spec#Numeric_types
[9]: https://golang.org/ref/spec#Blank_identifier

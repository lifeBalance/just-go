# Expressions

An [expression](https://go.dev/ref/spec#Expressions) is a piece of code that produces a value. Expressions are the building blocks of Go programs - they're what you use to compute values, make decisions, and manipulate data.

For example:

```go
x + 5           // applies + operator
len("hello")    // applies function
x > 10          // applies > operator
getUserName()   // applies function call
```

All the lines in the code above are expressions. They combine literal values (such as `5` or `"hello"`), operands and operators, and once evaluated, produce a single value.

## Types of expressions

Depending on the operators used in our expressions, they can be classified in several groups.

### Literal expressions

The simplest expressions are literal values, no operators:

```go
42          // integer literal
3.14        // float literal
"hello"     // string literal
true        // boolean literal
'a'         // rune literal
```

These can barely be considered expressions.

### Variable expressions

Variables themselves are expressions that evaluate to their stored value:

```go
x := 10
y := x + 5  // x is an expression that evaluates to 10
fmt.Println(y)  // 15
```

### Arithmetic expressions

Expressions using arithmetic operators:

```go
a := 10
b := 3

sum := a + b        // 13
difference := a - b // 7
product := a * b    // 30
quotient := a / b   // 3
remainder := a % b  // 1
```

### Comparison expressions

These are expressions that evaluate to a boolean values:

```go
x := 10
y := 20

fmt.Println(x == y)  // false
fmt.Println(x != y)  // true
fmt.Println(x < y)   // true
fmt.Println(x > y)   // false
fmt.Println(x <= y)  // true
fmt.Println(x >= y)  // false
```

### Logical expressions

Combine boolean values:

```go
age := 25
hasLicense := true

canDrive := age >= 18 && hasLicense  // true (both conditions met)
isTeenOrAdult := age < 13 || age >= 18  // true (at least one condition met)
notReady := !hasLicense  // false (negation)
```

### Function call expressions

Function calls are expressions if they return a value:

```go
import "strings"

result := strings.ToUpper("hello")  // "HELLO"
length := len("hello")              // 5

// Multiple return values
value, err := someFunction()
```

### Method call expressions

Similar to function calls, but on a receiver:

```go
s := "hello"
upper := s.ToUpper()  // method call expression - won't work, this is just an example

numbers := []int{1, 2, 3}
first := numbers[0]  // 1 (index expression)
```

### Type conversion expressions

Converting one type to another:

```go
x := 42
f := float64(x)  // 42.0
s := string(x)   // converts to rune, not "42"

// For string conversion of numbers, use strconv
import "strconv"
str := strconv.Itoa(x)  // "42"
```

### Composite literal expressions

Creating structs, arrays, slices, and maps:

```go
// Struct literal
person := struct {
    name string
    age  int
}{
    name: "Alice",
    age:  30,
}

// Slice literal
numbers := []int{1, 2, 3, 4, 5}

// Map literal
scores := map[string]int{
    "Alice": 95,
    "Bob":   87,
}
```

### Operator precedence

Go follows standard mathematical operator precedence. From highest to lowest:

```go
result := 2 + 3 * 4    // 14 (not 20)
// Multiplication happens first: 3 * 4 = 12, then 2 + 12 = 14

result := (2 + 3) * 4  // 20
// Parentheses force addition first: 2 + 3 = 5, then 5 * 4 = 20
```

Precedence levels (highest to lowest):

1. `*`, `/`, `%` (multiplication, division, modulo)
2. `+`, `-` (addition, subtraction)
3. `==`, `!=`, `<`, `<=`, `>`, `>=` (comparison)
4. `&&` (logical AND)
5. `||` (logical OR)

### Expressions vs statements

It's important to distinguish between expressions and statements. Expressions produce values:

```go
5 + 3           // expression, evaluates to 8
x > 10          // expression, evaluates to true or false
getUserName()   // expression if it returns a value
```

Statements perform actions but don't produce values:

```go
x := 5          // assignment statement
if x > 10 {}    // if statement
for i := 0; i < 10; i++ {}  // for statement
```

However, some things can be used as both:

```go
// Function call as a statement (ignoring return value)
fmt.Println("hello")

// Function call as an expression (using return value)
length := len("hello")
```

### Short-circuit evaluation

Logical operators && and || use short-circuit evaluation:

```go
// If first condition is false, second is never evaluated
if false && riskyFunction() {
    // riskyFunction() is never called
}

// If first condition is true, second is never evaluated
if true || riskyFunction() {
    // riskyFunction() is never called
}
```

This is useful for avoiding errors:

```go
// Safe: checks length before accessing index
if len(slice) > 0 && slice[0] == 42 {
    fmt.Println("First element is 42")
}
```

### Expression complexity

You can combine expressions to create complex logic:

```go
age := 25
income := 50000
hasGoodCredit := true

// Complex boolean expression
canGetLoan := (age >= 18 && age <= 65) &&
              (income > 30000 || hasGoodCredit) &&
              !hasBankruptcy

// Breaking it down improves readability
isValidAge := age >= 18 && age <= 65
hasFinancialStability := income > 30000 || hasGoodCredit
canGetLoan := isValidAge && hasFinancialStability && !hasBankruptcy
```

<Admonition type="tip" title="Best practice">
While Go allows complex expressions, breaking them into smaller, named parts often makes code more readable and easier to debug.
</Admonition>

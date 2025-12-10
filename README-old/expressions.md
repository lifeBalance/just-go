# Expressions

An [expression](https://go.dev/ref/spec#Expressions) is a piece of code that produces a value. Expressions are the building blocks of Go programs - they're what you use to compute values, make decisions, and manipulate data.

## Primary Expressions

Primary expressions are the basic building blocks of more complex expressions in Go. They are the operands for operators.

Primary expressions cannot appear by themselves in a program; doing so would generate a **compilation error** about the value not being used.

### Operands

Operands are the simplest primary expressions. They include:

- Literal values, such as `5` or the string `"hello"`
- Identifiers such as variables or constant names.
- Combinations of the above, inside parentheses.

The simplest expressions are **literal values**, no operators:

```go
42          // integer literal
3.14        // float literal
"hello"     // string literal
true        // boolean literal
'a'         // rune literal
```

Variables (or constants) by themselves are very simple expressions, that evaluate to their stored value. For example:

```go
5           // literal value
"hello"     // literal value
x           // variable name
```

We can also combine literals and identifiers in parentheses:

```go
(x + 5)     // combination of identifier and literal value
```

Operands can not appear by themselves in a program, they must show up in some [statement](https://go.dev/ref/spec#Statements), like an assignment, a condition, etc:

```go
x := 10         // A literal in an assignment
y := x + 5      // A literal and a variable in an arithmetic expression
fmt.Println(y)  // An identifier as an argument to a function
```

To summarize, operands are the simplest form of expression, and they can show up by themselves in a single line of a program. They're often used as the building blocks of more complex expressions.

<Admonition title="Statements">
Operands are used as part of statements, like the assignment statement for example. Statements can indeed show up by themselves taking a line of code.
</Admonition>

### Selectors

When we access the field or method of a **struct**, the result evaluates to some value, hence is a primary expression:

```go
bob := struct{
    name string
    age int
}{
    name: "Robert",
    age: 42,
}

fmt.Println(bob.name)
```

In the code above, `bob.name` is a selector which evaluates to whatever value is stored there. Once that's evaluated, `fmt.Println` will print it.

### Index Expressions

This is the stuff that we wrap in **square brackets** to access elements in arrays, slices, strings, or maps:

```go
array[0]           // array/slice element
myMap["key"]       // map value
str[2]             // byte in string at index 2
```

### Slicing expressions

Create slices from arrays, slices, or strings:

```go
array[1:4]         // elements from index 1 to 3
slice[:3]          // first 3 elements
slice[2:]          // from index 2 to end
slice[:]           // full slice
```

### Type Assertions

Extract the concrete value from an interface:

```go
value := interfaceVar.(ConcreteType)
value, ok := interfaceVar.(ConcreteType)  // safe version
```

### Function and Method calls

Whenever a function or method returns a value, it's considered a primary expression:

```go
len("hello")           // evaluates to 5
strings.ToUpper("hi")  // evaluates to "HI"
math.Max(5, 10)        // evaluates to 10
```

---

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

### Variable Expressions

Variables by themselves are very simple expressions, that evaluate to their stored value:

```go
x := 10
y := x + 5  // x is an expression that evaluates to 10
fmt.Println(y)  // 15
```

The second line contains the expression `x + 5` which evaluates to `15`. But the `x` is that expression is also an expression that evaluates to `10`. Basically, the compiler, before evaluating `x + 5`, it must evaluate `x`.

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

### Boolean expressions

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

We have the same operators we may find in other languages:

- `==` equal to
- `!=` not equal to
- `<` less than
- `<=` less or equal than
- `>` greater than
- `>=` greater or equal than

It's important to remember that both operands in a comparison expression must have the same type, otherwise we can't compare them.

### Compound Boolean Expressions

We can combine boolean expressions with the help of **boolean operators**:

```go
age := 25
hasLicense := true

canDrive := age >= 18 && hasLicense  // true (both conditions met)
isTeenOrAdult := age < 13 || age >= 18  // true (at least one condition met)
notReady := !hasLicense  // false (negation)
```

Again, Go offers the same boolean operators you can find in other languages:

- `&&` the **and** operator, which evaluates to `true` when both operands are `true`.
- `||` the **or** operator, which evaluates to `true` as long as any of its operands are `true`.

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

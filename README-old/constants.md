# Constants
[Constants are declared][1] like variables, but with the `const` keyword. [Constants][2] can only be assigned:

* Rune values
* Booleans
* Integers
* Floats
* Complex numbers
* Strings

They cannot be declared using the short syntax (`:=`). The same as variables, we can define constants without declaring their type (it can be inferred from the type of the assigned value ).

For example:
```Go
const PI = 3.14
```

## The iota identifier
In Go we have available a [predeclared identifier][3] called [iota][4] that can only be used in **constants declarations**. The `iota` identifier simplifies constants definitions using autoincrementing assignments. It starts at 0 and autoincrements at each implicit semicolon (end of line).

For example:
```Go
const (
    A = iota  // iota = 0; A = 0
    B = iota  // iota = 1; B = 1
    C = iota  // iota = 2; C = 2
)
```

### Omitting initialization values
We can also omit the initialization values for the constants `B` and `C` since they are gonna be `iota` by default. For example:
```Go
const (
    A = iota  // iota = 0; A = 0
    B         // iota = 1; B = 1
    C         // iota = 2; C = 2
)
```

### Skipping values
We can use underscores to skip the unwanted values:
```Go
const (
    A = iota  // iota = 0; A = 0
    B         // iota = 1; B = 1
    _         // Skipping 2
    _         // Skipping 3
    C         // iota = 4; C = 4
)
```

### Using expressions
We can also use expressions like this one:
```Go
const (
    A = iota * 2  // iota = 0; A = 0
    B             // iota = 1; B = 2
    _             // iota = 2; Skipping 4
    _             // iota = 3; Skipping 6
    C             // iota = 4; C = 8
)
```

If we put 2 constants in the same line, they both get the same value:
```Go
const (
    A = iota + 1  // iota = 0; A =
    B             // iota = 1; B = 1
    C, D          // iota = 2; C and D = 3
    E             // iota = 3; E = 4
)
```

---
[:arrow_backward:][back] ║ [:house:][home] ║ [:arrow_forward:][next]

<!-- navigation -->
[home]: ../README.md
[back]: variables.md
[next]: types.md


<!-- links -->
[1]: https://golang.org/ref/spec#Constant_declarations
[2]: https://golang.org/ref/spec#Constants
[3]: https://golang.org/ref/spec#Predeclared_identifiers
[4]: https://golang.org/ref/spec#Iota

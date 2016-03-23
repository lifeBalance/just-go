# Lexical Elements
The Go programming language is pretty well documented. Even if we don't have access to the internet we can start a local server with a copy of most of the [golang's official site][1] just by running:
```
$ godoc -http=:8080
```

The [Documents section][2] of the site contains plenty of resources that make working with the language a breeze. One of the main references is the [Language Specification][3]. In most programming languages specs are dry and difficult to read, but in the case of Go, they're surprisingly clear. One of the spec sections that draw my attention was [Lexical elements][4].

A **lexical element** refers to a character or group of characters that might legally appear in a source code file:

* Comments
* Tokens:
  * Identifiers
  * Keywords
  * Operators and delimiters
  * Literals:
    * Integer literals
    * Floating-point literals
    * Imaginary literals
    * Rune literals
    * String literals

In this section we are going to briefly go over these lexical elements.

## Comments
Go allows two forms of comments:

1. **Line comments** start with the character sequence `//` and stop at the end of the line, like this:
  ```Go
  // This is a line comment
  ```

2. **General comments** may contain one or more lines. For example:
  ```Go
  /*      This is
  *       a multiline
  *       comment
  */
  ```

  When a general comment is all on one line (e.g., `/* inline comment */`), it is treated as a **space**, and when a general comment spans one or more lines it it treated as a **newline**.

## Tokens
When our source code is compiled, is treated as a sequence of tokens. A token is the smallest independent unit of meaning in a program. We can say that tokens form the vocabulary of the Go language. There are four classes:

* Identifiers
* Keywords
* Operators and delimiters
* Literals

Tokens are separated by **white space**, apart from that white space is ignored by the compiler. It is considered white space the following characters:

* spaces (U+0020)
* horizontal tabs (U+0009)
* carriage returns (U+000D)
* newlines (U+000A)

## Semicolons
In Go most of the times we can omit **semicolons** since they are automatically inserted by the compiler. Semicolons are inserted at the end of blank lines, when the last token is:

* An **identifier**
* An integer, floating-point, or imaginary number, as well as a rune, or string literal
* One of the keywords `break`, `continue`, `fallthrough`, or `return`
* One of the operators `++` or `--`
* A closing delimiter, such as `)`, `]` or `}`.

## Identifiers
Identifiers name program entities such as **variables** and **types**. An identifier is a sequence of one or more letters and digits. There are certain rules for identifiers:

* Its **first character** must be a letter.
* A **keyword** cannot be used as an identifier.
* Some identifiers are predeclared. These cannot be used as regular identifiers either.

### The blank identifier
The underscore character `_` is a special identifier, called the **blank identifier**. It can be used in declarations or variable assignments like any other identifier. The blank identifier is useful in those cases we don’t want to use a variable we have already declared, what generates a compiling error. In those cases we use the `_` instead. For example:
```Go
// Put example here
```

## Keywords
Go only has **25 keywords**, which is one of the reasons why is known as a relatively easy to learn language. The language has been designed with a deliberately small number of keywords to simplify the **code-parsing**, the first step in the compilation process. The following table group them:

| Keywords |             |        |           |        |
|:---------|:------------|:-------|:----------|:-------|
| break    | default     | func   | interface | select |
| case     | defer       | go     | map       | struct |
| chan     | else        | goto   | package   | switch |
| const    | fallthrough | if     | range     | type   |
| continue | for         | import | return    | var    |

## Operators, Delimiters and other special tokens
Regarding operators, Go offers the common ones that we can find in other languages and some more.

### Arithmetic operators
Regarding [arithmetic operators][5] we have:

* **Standard operators** which apply to numeric values and yield a result of the same type as the first operand:
  * Sum: `+`. This operator is also used with **strings** for [string concatenation][6].
  * Difference: `-`
  * Product: `*`
  * Division: `/`
  * Remainder: `%`

* **Bitwise operators** which apply to **integers** only:
  * Bitwise AND: `&`
  * Bitwise OR: `|`
  * Bitwise XOR: `^`
  * Bit clear (AND NOT): `&^`

* **Shift operators** which also apply to **integers** only shifting the left operand by the shift count specified by the right operand:
  * Left shift: `<<`
  * Right shift: `>>`

### Assignment operators
The Go language supports a variety of assignment operators. First of all, the normal **assignment operator** (`=`), assigns values from right side operands to left side operand.

Then we have a series of operators which are a combination of arithmetic and assignment operators. For example, the `+=` operator adds the right operand to the left operand and assign the result to left operand. The following two expressions are equivalent:
```Go
x = x + y
x += y
```

The following operators work in the same fashion:

* `-=`, substract and assign.
* `*=`, multiply and assign.
* `/=`, divide and assign.
* `%=`, get the remainder and assign.
* `<<=`, left shift and assign.
* `>>=`, right shift and assign.
* `&=`, bitwise AND and assign.
* `|=`, bitwise inclusive OR and assign.
* `^=`, bitwise exclusive OR and assign.


### Comparison operators
[Comparison operators][7] compare two operands and yield an untyped boolean value:
  * Equal: `==`
  * Not equal: `!=`
  * Less: `< `
  * Less or equal: `<=`
  * Greater: `> `
  * Greater or equal: `>=`

### Logical operators
[Logical operators][8] apply to boolean values and yield a result of the same type as the operands:
  * Conditional AND: `&&`
  * Conditional OR: `||`
  * Conditional NOT: `!`

### Address operators
We are just gonna mention here that they're used to generate pointers. Check the specs about [address operators][9].

### Receive operators
Again briefly, these are used for working with channels. Check the [specs][10] for more info.

### Delimiters
Regarding delimiters we have:

* Parentheses `()`
* Square brackets `[]`
* Curly braces `{}`
* The comma `,`

### Other special tokens
There are other special tokens used in the language that don't fit in the operators category:

* The `:=` symbol, for **short variable declarations**.
* The increment (`++`) and decrement (`--`) statements.
* The ellipsis (`...`) for defining parameters in **variadic functions**.

## Integer literals
An [integer literal][11] is a sequence of digits representing an integer value. We can use **prefixes** for representing integers in bases other than 10. For example:

* `0` for octal.
* `0x` or `0X` for hexadecimal. In hexadecimal literals, letters **a-f** and **A-F** represent values 10 through 15.

## Floating-point literals
A [floating-point literal][12] is a decimal representation of a floating-point

## Imaginary literals
An [imaginary literal][13] is a decimal representation of the imaginary part of a complex number. It consists of a floating-point literal or decimal integer followed by the lower-case letter `i`. For example,

## Rune literals
A [rune literal][14] represents a rune constant, an integer value identifying a Unicode code point.

## String literals
A [string literal][15] represents a string value. In Go there are two forms of string literals:

* **Raw string literals** are character sequences between back quotes, as in ``foo``. Within the quotes, any character may appear except another back quote.
* **Interpreted string literals** are character sequences between double quotes, as in `"bar"`. Within the quotes, any character may appear except newline or another unescaped double quote.


---
[:arrow_backward:][back] ║ [:house:][home] ║ [:arrow_forward:][next]

<!-- navigation -->
[home]: ../README.md
[back]: installing.md
[next]: #


<!-- links -->
[1]: https://golang.org/
[2]: https://golang.org/code
[3]: https://golang.org/ref/spec
[4]: https://golang.org/ref/spec#Lexical_elements
[5]: https://golang.org/ref/spec#Arithmetic_operators
[6]: https://golang.org/ref/spec#String_concatenation
[7]: https://golang.org/ref/spec#Comparison_operators
[8]: https://golang.org/ref/spec#Logical_operators
[9]: https://golang.org/ref/spec#Address_operators
[10]: https://golang.org/ref/spec#Receive_operator
[11]: https://golang.org/ref/spec#Integer_literals
[12]: https://golang.org/ref/spec#Floating-point_literals
[13]: https://golang.org/ref/spec#Imaginary_literals
[14]: https://golang.org/ref/spec#Rune_literals
[15]: https://golang.org/ref/spec#String_literals

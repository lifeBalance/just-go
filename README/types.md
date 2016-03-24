# Types
In the previous section we have mentioned that Go is a **statically typed** programming language. This means that variables always have a specific [type][1] and that type cannot change. In this section we are going to examine several **built-in data types** included in Go as well as **user-defined data types**.

We can categorize Go's types into:

* Basic types:
  * [Numbers][2]
  * [Strings][3]
  * [Booleans][4]
* Aggregate types
  * [Arrays][5]
  * [Structs][6]
* Reference types
  * [Pointers][7]
  * [Slices][8]
  * [Maps][9]
  * [Functions][10]
  * [Channels][11]
* [Interfaces][12]

## Basic types
### Numbers
Go has several different types to represent numbers. Generally we split numbers into two different kinds:

* Integer numbers.
* Floating-point numbers.

#### Integers
Integer numbers are, like in maths, numbers without a decimal component. In mathematics, the set of integers consists of:

* The number **zero** (0)
* The **natural numbers** (1, 2, 3, ...)
* And the **negative integers** (−1, −2, −3, ...)

The set of integer numbers is countably **infinite**. In computer science we are constrained by the size of the memory, meaning that integers are a data type that represents a finite subset of the mathematical integers.

In Go we have several integer types which we can classify in 4 groups:

1. **Unsigned integers**, in other words all positive numbers. We can differentiate 4 types in this group:

  * `uint8` - the set of all unsigned 8-bit integers (0 to 255)
  * `uint16` - the set of all unsigned 16-bit integers (0 to 65535)
  * `uint32` - the set of all unsigned 32-bit integers (0 to 4294967295)
  * `uint64` - the set of all unsigned 64-bit integers (0 to 18446744073709551615)

2. **Signed integers**, also 4 types in this group:

  * `int8` - the set of all signed 8-bit integers (-128 to 127)
  * `int16` - the set of all signed 16-bit integers (-32768 to 32767)
  * `int32` - the set of all signed 32-bit integers (-2147483648 to 2147483647)
  * `int64` - the set of all signed 64-bit integers (-9223372036854775808 to 9223372036854775807)

3. There are also two **alias types**:

  * `byte` - which is the same as `uint8`.
  * `rune` - which is an alias for `int32`.

  Except these last 2 types, all numeric types are different so conversions are required when different numeric types are mixed in an expression or assignment.

4. Finally, there are also 3 **machine dependent** integer types. `uint`, `int` and `uintptr`. They are machine dependent because their size depends on the type of architecture you are using.

Generally speaking if you are working with integers you should just use the `int` type.

### Strings
In Go, [strings][3] are sequences of [UTF-8][13] characters. As opposed to other languages where strings are sequences of fixed-width characters, strings in Go use **variable-width characters** (1 to 4 bytes). So Go can use 4 bytes characters when needed, but whenever it’s possible, it uses 1 byte characters, for example for storing [ASCII][14] characters.

**UTF-8** is the most widely used [Unicode][15] encoding. Each Unicode character has a unique identifying number called a **code point** The UTF-8 encoding is the standard encoding for text files, XML and JSON files. It uses between one and four bytes to represent each code point. **ASCII** is a subset of UTF-8, its code points use one byte.

Strings are **immutable**: once created, it is impossible to change the contents of a string. The [predeclared identifier][16] for strings is `string`.

#### String literals
[String literals][17] are created using:

* Interpreted string literals are surrounded by **double quotes** as in:
```Go
"A string literal"
```

* Raw string literals are surrounded by **backticks**, like:
```Go
`Another string literal`
```

Interpreted string literals are the most commonly used kind, but raw string literals are useful for writing multiline messages, HTML, and regular expressions.

##### Interpreted string literals
Strings surrounded by double quotes can not span multiple lines. For example:
```Go
var emptyString string = ""
var nickname string = "TeddyBear69"
```

> A string may consist of an empty sequence of bytes, what is known as an **empty string**.

These strings support the **escape sequences** listed in the following table:

| Escape       | Meaning                                                           |
|:-------------|:------------------------------------------------------------------|
| `\\`         | Backslash \                                                       |
| `\ooo`       | Unicode character with the given 3-digit 8-bit octal code point   |
| `\'`         | Single quote (‘); only allowed inside character literals          |
| `\"`         | Double quote (”); only allowed inside interpreted string literals |
| `\a`         | ASCII bell (BEL)                                                  |
| `\b`         | ASCII backspace (BS)                                              |
| `\f`         | ASCII formfeed (FF)                                               |
| `\n`         | ASCII linefeed (LF)                                               |
| `\r`         | ASCII carriage return (CR)                                        |
| `\t`         | ASCII tab (TAB)                                                   |
| `\uhhhh`     | Unicode character with the given 4-digit 16-bit hex code point    |
| `\Uhhhhhhhh` | Unicode character with the given 8-digit 32-bit hex code point    |
| `\v`         | ASCII vertical tab (VT)                                           |
| `\xhh`       | Unicode character with the given 2-digit 8-bit hex code point     |

##### Raw string literals
**Backticks** are used to create raw string literals. These strings may span multiple lines but they do not support any escape sequences and may contain any character except for a backtick.

### Booleans
The [boolean type][4] only contains two values denoted by the predeclared constants `true` and `false`. The [predeclared identifier][16] for the boolean type is `bool`.


---
[:arrow_backward:][back] ║ [:house:][home] ║ [:arrow_forward:][next]

<!-- navigation -->
[home]: ../README.md
[back]: ../README.md
[next]: workspace.md


<!-- links -->
[1]: https://golang.org/ref/spec#Types
[2]: https://golang.org/ref/spec#Numeric_types
[3]: https://golang.org/ref/spec#String_types
[4]: https://golang.org/ref/spec#Boolean_types
[5]: https://golang.org/ref/spec#Array_types
[6]: https://golang.org/ref/spec#Struct_types
[7]: https://golang.org/ref/spec#Pointer_types
[8]: https://golang.org/ref/spec#Slice_types
[9]: https://golang.org/ref/spec#Map_types
[10]: https://golang.org/ref/spec#Function_types
[11]: https://golang.org/ref/spec#Channel_types
[12]: https://golang.org/ref/spec#Interface_types
[13]: https://en.wikipedia.org/wiki/UTF-8
[14]: https://en.wikipedia.org/wiki/ASCII
[15]: https://en.wikipedia.org/wiki/Unicode
[16]: https://golang.org/ref/spec#Predeclared_identifiers
[17]: https://golang.org/ref/spec#String_literals

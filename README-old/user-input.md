# Reading user input

We saw at the beginning of the course a very simple way of reading user input, the [fmt.Scan](https://pkg.go.dev/fmt#Scan) function.

## Buffered Input

In computer science, a [buffer](https://en.wikipedia.org/wiki/Data_buffer) is a region of memory used to store data temporarily while it is being moved from one place to another.

The `fmt.Scan` function works by reading individual tokens, as the user enters them in the keyboard. Reading each character requires a separate **system call**.

On the other hand, using buffered input, we use a system call to reserve some space in memory, where the user input will be stored. This requires a **single system call**.

## The `bufio` Package

The [bufio](https://pkg.go.dev/bufio) package includes functionality for reading user input using buffer. As you may have guessed, before anything, we have to create a buffer. For example:

```go
reader := bufio.NewReader(os.Stdin)
```

This creates a new buffered reader that reads from standard input (`os.Stdin`). Once we have a reader, we can use various methods to read input.

### Reading a Full Line

```go
import (
    "bufio"
    "fmt"
    "os"
)

func main() {
    reader := bufio.NewReader(os.Stdin)
    input, err := reader.ReadString('\n')
    if err != nil {
        fmt.Println("Error reading input:", err)
        return
    }
    fmt.Println("You entered:", input)
}
```

The `ReadString('\n')` method reads until it encounters a newline character (or whatever we specify as **argument**), allowing us to capture entire lines including spaces.

## The x Package

Imagine we have the following program:

```go
package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

func main() {
	reader := bufio.NewReader(os.Stdin)

	for {
		fmt.Print("-> ")
		userInput, _ := reader.ReadString('\n')

		userInput = strings.ReplaceAll(userInput, "\n", "")

		if userInput == "quit" {
			break
		} else {
			fmt.Println(userInput)
		}
	}
}
```

Basically, we're echoing the user input until she enters the string `quit`. But what if we wanted to exit the program whenever a **single keypress** is enter? We can install a third-party package named [keyboard](github.com/eiannone/keyboard):

```sh
go get github.com/eiannone/keyboard
```

This is the new version:

```go
package main

import (
	"fmt"

	"github.com/eiannone/keyboard"
)

func main() {
	err := keyboard.Open()
	if err != nil {
		panic(err)
	}

	defer func() {
		_ = keyboard.Close() // Cleanup when the program is over
	}()

	fmt.Println("Press ESC to quit")
	for {
		var line []rune // We'll append characters to this variable
		fmt.Print("-> ")

		for {
			char, key, err := keyboard.GetKey()
			if err != nil {
				panic(err)
			}

			if key == keyboard.KeyEsc {
				return
			} else if key == keyboard.KeyEnter {
				fmt.Println()             // Move to next line
				fmt.Println(string(line)) // Print the line
				line = nil                // Clear the line
				break
			} else if char != 0 {
				line = append(line, char) // Append the character to the line
				fmt.Printf("%c", char)    // Echo character
			}
		}
	}
}
```

It works the same as the previous one, only that this time, the user has to press the **Escape** key to exit the program. Let's go over the code:

- A [defer](https://go.dev/ref/spec#Defer_statements) statement is used to call a function, whenever the surrounding function returns for any reason:

- A `return` statement.
- End of the function's body.
- A [runtime panic](https://go.dev/ref/spec#Run_time_panics) happens.

Note that right after the `defer` statement we use an **anonymous function**, which does some cleanup.
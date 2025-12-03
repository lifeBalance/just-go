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

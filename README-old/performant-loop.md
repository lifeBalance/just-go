# Performant Loops

You have to write a program that prints the multiples of `7` between `0` and `100` (both included). You could write the loop this way:

```go
package main

import "fmt"

func main() {
    for i := 0; i <= 100; i++ {
        if i % 7 == 0 {
            fmt.Println(i)
        }
    }
}
```

You know that this loop is gonna run `101` times (from `0` to `100` both included), and each time, is gonna perform a **modulo operation** in the `if` condition. You can verify the amount of iterations with a **helper variable**:

```go
package main

import "fmt"

func main() {
    count := 0

    for i := 0; i <= 100; i++ {
        count++
        if i % 7 == 0 {
            fmt.Println(i)
        }
    }

    fmt.Println("Count is:", count) // 101
}
```

Another way to solve this problem is like this:

```go
package main

import "fmt"

func main() {
    for i := 0; i <= 100; i += 7 {
        fmt.Println(i)
    }
}
```

This second loop is not only easier to read, but also way more performant, since it only iterates `15` times! Add a counter to verify that:

```go
package main

import "fmt"

func main() {
    count := 0

    for i := 0; i <= 100; i += 7 {
        count++
        fmt.Println(i)
    }

    fmt.Println("Count is:", count) // 15
}
```


// Helloworld prints the string "Hello, World!" backwards.
package main

import (
	"fmt"
	"local_packages/stringutil"
)

func main() {
	fmt.Println(stringutil.Reverse("Hello, World!"))
}

// Command greet prints a personalized greeting using the foo package.
package main

import (
	"flag"
	"fmt"

	foo "example.com/demo2/foo"
)

// DefaultName is used when no name flag is provided.
const DefaultName = "Gopher"

// NameFlag stores the value provided via the --name flag.
var NameFlag = flag.String("name", DefaultName, "person to greet")

// MessageFlag stores the value provided via the --message flag.
var MessageFlag = flag.String("message", foo.DefaultMessage, "message to include in the greeting")

func main() {
	flag.Parse()

	greeter := foo.New(*MessageFlag)
	fmt.Println(greeter.Greet(*NameFlag))
}

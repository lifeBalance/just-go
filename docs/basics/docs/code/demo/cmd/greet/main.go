// Command greet prints a personalized greeting using the foo package.
package main

import (
	"flag"
	"fmt"

	"myapp.com/demo/foo"
)

// defaultName is used when no name flag is provided.
const defaultName = "Gopher"

// name stores the value provided via the --name flag.
var name = flag.String("name", defaultName, "person to greet")

// message stores the value provided via the --message flag.
var message = flag.String("message", foo.DefaultMessage, "message to include in the greeting")

func main() {
	flag.Parse()

	greeter := foo.New(*message)
	fmt.Println(greeter.Greet(*name))
}

// Package foo provides helpers for building friendly greetings.
package foo

// Greeter holds a message used when greeting someone.
type Greeter struct {
	// Message contains the customizable portion of the greeting.
	Message string
}

// DefaultMessage is used when a caller does not supply custom text.
const DefaultMessage = "Welcome to the Foo greeting tool!"

// New returns a Greeter initialized with the provided message.
func New(message string) Greeter {
	if message == "" {
		message = DefaultMessage
	}
	return Greeter{Message: message}
}

// Greet returns the greeting message with a friendly prefix.
func (g Greeter) Greet(name string) string {
	if name == "" {
		name = "friend"
	}
	return "Hello, " + name + "! " + g.Message
}

// Package foo provides greeting utilities with testable examples.
package foo

// DefaultMessage is used when callers omit custom text.
const DefaultMessage = "Hello"

// Greeter represents a polite entity that can greet by name.
type Greeter struct {
	// Prefix is prepended to every greeting produced by this Greeter.
	Prefix string
}

// New returns a Greeter with the provided prefix.
func New(prefix string) Greeter {
	if prefix == "" {
		prefix = DefaultMessage
	}
	return Greeter{Prefix: prefix}
}

// Greet builds a salutation for the specified name.
func (g Greeter) Greet(name string) string {
	if name == "" {
		name = "friend"
	}
	return g.Prefix + ", " + name + "!"
}

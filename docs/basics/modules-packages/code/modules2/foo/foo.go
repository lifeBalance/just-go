package foo

import "strings"

func Foo(s string) string {
	return fooInternal(s)
}

func fooInternal(s string) string {
	return strings.ToUpper(s)
}

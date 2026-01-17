package foo_test

import (
	foo "demo/foo"
	"testing"
)

func TestFoo(t *testing.T) {
	want := "expected"
	got := foo.Foo("EXPECTED")
	if got != want {
		t.Errorf("Foo() = %q, want %q", got, want)
	}
}

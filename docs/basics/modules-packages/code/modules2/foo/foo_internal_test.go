package foo

import (
	"testing"
)

func TestFoo(t *testing.T) {
	want := "expected"
	got := Foo("EXPECTED")
	if got != want {
		t.Errorf("Foo() = %q, want %q", got, want)
	}
}

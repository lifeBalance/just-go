package main

import (
	"testing"
)

func TestGreet(t *testing.T) {
	name := "World"
	want := "Hello World!"
	got := Greet(name)
	if got != want {
		t.Errorf("Greet(%q) = %q; want %q", name, got, want)
	}
}

package foo_test

import (
	foo "demo"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestFoo(t *testing.T) {

	want := "expected"
	got := foo.Foo("EXPECTED")
	assert.Equal(t, want, got)
}

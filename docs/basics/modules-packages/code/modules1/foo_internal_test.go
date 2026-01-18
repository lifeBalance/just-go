package foo

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestFoo(t *testing.T) {
	want := "expected"
	got := Foo("EXPECTED")
	assert.Equal(t, want, got)
}

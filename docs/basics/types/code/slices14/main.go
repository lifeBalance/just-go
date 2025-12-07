package main

import (
	"fmt"
	"sort"
)

func main() {
	names := []string{
		"Bob",
		"Lisa",
		"Frank",
	}

	fmt.Println(sort.StringsAreSorted(names)) // false
	sort.Strings(names)                       // Sort the slice
	fmt.Println(sort.StringsAreSorted(names)) // true
	fmt.Println(names)                        // [Bob Frank Lisa]
}

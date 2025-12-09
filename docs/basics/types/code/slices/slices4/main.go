package main

import (
	"encoding/json"
	"fmt"
)

func main() {
	files := []string{}       // empty slice
	fmt.Println(files)        // []
	fmt.Println(files == nil) // false
	jsonData, err := json.Marshal(files)
	if err != nil {
		panic(err)
	}

	fmt.Println(string(jsonData)) // [] ✅ Not null!
}

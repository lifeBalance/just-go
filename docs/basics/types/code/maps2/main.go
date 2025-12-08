package main

import (
	"fmt"
	"strings"
)

func main() {
	players := map[int]string{
		0: "Ralphie",
		1: "Alice",
		2: "Bob",
	}

	fmt.Println(players) // map[0:Ralphie 1:Alice 2:Bob]
	lowerCasePlayers(players)
	fmt.Println(players) // map[0:ralphie 1:alice 2:bob]
}

func lowerCasePlayers(m map[int]string) {
	for k, p := range m {
		m[k] = strings.ToLower(p)
	}
}

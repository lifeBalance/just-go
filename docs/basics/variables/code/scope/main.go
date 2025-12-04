package main

import (
	"fmt"
	"myapp/somepkg"
)

func main() {
	fmt.Println(somepkg.SomeVar) // ✅ I'm SomeVar
	somepkg.DoSomething()        // ✅ I'm someVar
	// fmt.Println(somepkg.unexportedVar) // ❌ Error
}

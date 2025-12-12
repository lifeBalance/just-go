package main

import (
	"bufio"
	"fmt"
	"myapp/logger"
	"os"
	"time"
)

func main() {
	reader := bufio.NewReader(os.Stdin)
	ch := make(chan string)

	go logger.LogMessages(ch)

	fmt.Println("Enter 5 lines:")
	for range 5 {
		fmt.Print("-> ")
		input, _ := reader.ReadString('\n')
		ch <- input // send input to channel
		time.Sleep(time.Millisecond * 100)
	}
}

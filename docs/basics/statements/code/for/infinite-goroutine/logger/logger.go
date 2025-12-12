package logger

import "log"

func LogMessages(ch chan string) func() {
	for {
		msg := <-ch // receive message from channel
		log.Println(msg)
	}
}

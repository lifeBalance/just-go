package main

import (
	"fmt"
	"hammerbitcoin/game"
)

func main() {
	playAgain := true

	for playAgain {
		game.Play()
		playAgain = game.GetYesOrNo("Would you like to play again (y/n)?")
	}

	fmt.Println("/nGoodbye.")

}

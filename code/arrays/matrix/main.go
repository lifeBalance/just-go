package main

import "fmt"

func main() {
	var a = [3][3]int{
		{11, 22},
		{44, 55, 66},
		{77, 88},
	}

	var matrix string

	for i := 0; i < 3; i++ {
		for j := 0; j < 3; j++ {
			matrix += fmt.Sprintf("%.2d ", a[i][j])
		}
		matrix += "\n"
	}
	fmt.Println(matrix)
}

package main

import "fmt"

// Rectangle is a simple struct
type Rectangle struct {
	width  float64
	height float64
}

// Area is a method with a receiver (r Rectangle)
// The receiver appears between 'func' and the method name
func (r Rectangle) Area() float64 {
	return r.width * r.height
}

// Perimeter is another method on Rectangle
func (r Rectangle) Perimeter() float64 {
	return 2 * (r.width + r.height)
}

// Scale is a method with a pointer receiver
// Use pointer receiver when you need to modify the receiver
func (r *Rectangle) Scale(factor float64) {
	r.width *= factor
	r.height *= factor
}

// Describe is a method that takes additional parameters
func (r Rectangle) Describe(unit string) string {
	return fmt.Sprintf("Rectangle: %.2f%s x %.2f%s", r.width, unit, r.height, unit)
}

func main() {
	rect := Rectangle{width: 10, height: 5}

	// Call methods using dot notation
	fmt.Println("Area:", rect.Area())           // Area: 50
	fmt.Println("Perimeter:", rect.Perimeter()) // Perimeter: 30
	fmt.Println(rect.Describe("cm"))            // Rectangle: 10.00cm x 5.00cm

	// Pointer receiver method modifies the original
	rect.Scale(2)
	fmt.Println("After scaling:", rect.Area()) // After scaling: 200

	// Note: Methods are just syntactic sugar for functions
	// rect.Area() is equivalent to Rectangle.Area(rect)
	fmt.Println("Using method expression:", Rectangle.Area(rect)) // 200
}

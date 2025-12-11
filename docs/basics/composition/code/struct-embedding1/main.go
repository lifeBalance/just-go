package main

import "fmt"

type Address struct {
	Street  string
	City    string
	Country string
	ZipCode string
}

type ContactInfo struct {
	Email   string
	Phone   string
	Address // Embedded Address struct
}

type User struct {
	ContactInfo // Embedded ContactInfo
	Username    string
	Age         int
}

func main() {
	user := User{
		ContactInfo: ContactInfo{
			Email: "alice@example.com",
			Phone: "555-1234",
			Address: Address{
				Street:  "123 Main St",
				City:    "Springfield",
				Country: "USA",
				ZipCode: "12345",
			},
		},
		Username: "alice42",
		Age:      30,
	}

	fmt.Println("Username:", user.Username) // alice42
	fmt.Println("Age:", user.Age)           // 30
	// Access promoted fields directly (nested promotion!)
	fmt.Println("Email:", user.Email)   // alice@example.com
	fmt.Println("Phone:", user.Phone)   // 555-1234
	fmt.Println("Street:", user.Street) // 123 Main St (from Address)
	fmt.Println("City:", user.City)     // Springfield (from Address)

	// Can also access via the chain
	fmt.Println("Full Address:", user.Address)            // Entire Address struct
	fmt.Println("Via chain:", user.ContactInfo.Address)   // Same Address struct
	fmt.Println("City via chain:", user.ContactInfo.City) // Springfield
}

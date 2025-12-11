package main

import "fmt"

type Address struct {
	Street  string
	City    string
	Country string
	ZipCode string
}

// Add a method to Address
func (a Address) FormatAddress() string {
	return fmt.Sprintf("%s, %s, %s %s",
		a.Street, a.City, a.Country, a.ZipCode)
}

type ContactInfo struct {
	Email   string
	Phone   string
	Address // Embedded Address struct
}

// Add a method to ContactInfo
func (ci ContactInfo) ContactSummary() string {
	return fmt.Sprintf("Email: %s, Phone: %s", ci.Email, ci.Phone)
}

type User struct {
	ContactInfo // Embedded ContactInfo
	Username    string
	Age         int
}

// Add a method to User
func (u User) DisplayName() string {
	return fmt.Sprintf("%s (Age: %d)", u.Username, u.Age)
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

	// Call methods on the base struct directly
	address := user.Address
	fmt.Println("Address:", address.FormatAddress())

	// Call methods on the embedded struct
	contact := user.ContactInfo
	fmt.Println("Contact Info", contact.ContactSummary())

	// Call User's own method
	fmt.Println("Username:", user.DisplayName())

	// Use method via promotion
	fmt.Println(user.FormatAddress())
	fmt.Println(user.ContactSummary())
}

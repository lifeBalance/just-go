### Initializing slices

We can initialize slices in several ways, one of them is using a built-in function called make. This function can take 3 arguments:

1. A **type**, which has to be the same as the type used when declaring the slice.
2. A **length**.
3. An optional **capacity**.

When called on a slice, `make()` allocates a **new array** in memory and returns a slice that refers to that array. For example:

```Go
// Declaring a slice
var s []byte

// Initializing a slice
s = make([]byte, 5)
```

Check the output of this code:

```
$ go run code/slices/05/main.go
The slice is: [0 0 0 0 0]
The length of the slice is: 5
The cap of the slice is: 5
slice == nil?: false
```

In this case our slice is not a `nil` reference anymore, now it’s pointing to an array of 5 elements, all of them are initialize with a value of `0`. Like in the following diagram:

![slice descriptor](images/slice_descriptor_2.png)

#### Specifying a capacity

If we need an array bigger than the slice, we can specify a **capacity** and pass it as the the **third argument** to `make()`. The capacity has to be equal or bigger than the length of the slice. For example:

```Go
// Declaring a slice
var s1 []byte

// Initializing a slice
s1 = make([]byte, 5, 8)

// Slicing a slice
s2 := s1[:cap(s1)]
```

Here we have specified a **capacity** (8) bigger than the **length** of the slice (5), so `make()` allocates an array with 8 elements. The second slice takes advantage of this bigger array. Check the output:

```
$ go run code/slices/06/main.go

s1: [0 0 0 0 0]
The length of s1: 5
The cap of s1: 8

s2: [0 0 0 0 0 0 0 0]
The length of s2 is: 8
The cap of s2 is: 8
```

## Arrays are values, slices are references

Arrays are **values**, whereas slices are **references** to those values. This has important implications:

1. Overlapping slices. Slices hold references to an underlying array, and if you assign one slice to another, both refer to the same array.
2. Functions. If a function takes a slice argument, changes it makes to the elements of the slice will be visible to the caller, analogous to passing a pointer to the underlying array. On the other hand, arrays are passed **by value** (i.e., copied) which is more expensive in memory terms, although this cost can be avoided by passing **pointers**. Slices are cheap to pass, because regardless of their length or capacity, they are just references. The size of a slice is **16-byte value** on 64-bit machines and as a **12-byte value** on 32-bit machines, no matter how many items it contains. This makes slice operations as efficient as manipulating array indices.

## Iterating over slices

Very often it is necessary to iterate over all the items in a slice. In those cases we use a `for` loop to iterate over the elements on an array or slice. Instead of creating a counter variable for controlling our iterations, it’s easier to use a `range` clause.

The `range` clause returns 2 values on each iteration:

1. The **key** of the element, often represented by a variable named `k`.
2. Its **value**, usually assigned to `v`.

Depending on which of these 2 values we are interested on, there are 3 ways of using a **for-range loop**:

1. Sometimes we are interested in both the **keys** and the **values**. For example:

```Go
fruits := []string{"Bananas", "Blueberries", "Raspberries"}

for i, v := range fruits {
  fmt.Printf("%d. %v\n", i+1, v)
}
```

If we run this we get:

```
$ go run code/slices/08/main.go
1. Bananas
2. Blueberries
3. Raspberries
```

2. If we need just the **keys**, it’s enough with not using the `v` variable. This maybe the case when what we want is to modify the items in the slice. For example:

```Go
fruits := []string{"Bananas", "Blueberries", "Raspberries"}

for i := range fruits {
  fmt.Printf("%d. Fruit\n", i+1)
}
```

If we run this we get:

```
$ go run code/slices/09/main.go
1. Fruit
2. Fruit
3. Fruit
```

3. Finally, there are the cases in what we want the **values** of the elements but not their keys. In these cases we have to use the **blank identifier** (`_`) to discard the returned keys. For example:

```Go
fruits := []string{"Bananas", "Blueberries", "Raspberries"}

for _, v := range fruits {
  fmt.Printf("* %v\n", v)
}
```

If we run this we get:

```
$ go run code/slices/10/main.go
* Bananas
* Blueberries
* Raspberries
```

# Installing Go
In this section we are gonna take care of how to get up and running programming in **Go**, from its installation to writing our first *Hello World* program.

The first step to get programming in Go is installing a Go distribution for our platform, also known as the **Go tools**. In the [golang official website][1] we can found detailed instructions for several platforms. Here I'm only gonna cover the installation process for **OS X**, the operating system I use.

## Installing the Go tools on OS X
There are a couple of ways of installing Go on OS X:

* Using the installer provided on the [golang official site][1]
* Using [Homebrew][3], the package manager for OS X.

### Using the installer
Once we point our browser to [golang official site][1], we just have to go to the [downloads section][2] an select the installer for **OS X** and download it. With the file in our hard-drive we just have to follow the normal procedure for installing software, basically next-next-accept. When the installation is complete, and if we haven't changed the **default location**, we'll find all the Go stuff at `/usr/local/go`.

Inside the installation folder (`/usr/local/go`) we should mention the `bin/` folder which contains 3 important **executables**:

1. The **compiler**, named `go`
2. The `godoc` **documentation tool**
3. A very useful utility for formatting our source code named `gofmt`

It's worth mentioning that if we don't change the **default location**, the installation process adds automatically the `bin/` folder to our `PATH` environment variable, so we can run any of these utilities from any location on our system.

#### Changing the default location
In **OS X**, the default location for our Go installation is `/usr/local/go`, but it can be changed. If we decided to change it, we would simply had to add an environment variable to our shell configuration. For example, if we wanted to install **Go** in our `$HOME` directory, we would have to add the following line to our `.bash_profile` (if you use Bash):
```
export PATH=$PATH:/usr/local/go/bin
```

> Setting the `GOROOT` variable should not be necessary in newer versions of Go.

#### Uninstalling
To **uninstall** Go, we would just have to delete the `/usr/local/go` folder and remove the `bin/` folder from our system's PATH. This is done by going to the `/etc/paths.d/` folder and once there, we have to delete the `go` file. This file contains:
```
/usr/local/go/bin
```

If you changed the default location for the installation and modified your `.bash_profile`, don't forget to get rid of those lines.

Once deleted, **Go** is out of our system, simple and clean.

### Using the Homebrew package manager
Installing the Go tools using Homebrew is as easy as running:
```bash
$ brew update # As usual
$ brew install go
==> Downloading https://homebrew.bintray.com/bottles/go-1.6.el_capitan.bottle.2.tar.gz
######################################################################## 100.0%
==> Pouring go-1.6.el_capitan.bottle.2.tar.gz
==> Caveats
As of go 1.2, a valid GOPATH is required to use the `go get` command:
  https://golang.org/doc/code.html#GOPATH

You may wish to add the GOROOT-based install location to your PATH:
  export PATH=$PATH:/usr/local/opt/go/libexec/bin
==> Summary
🍺  /usr/local/Cellar/go/1.6: 5,771 files, 324.9M
```

After running this command we should have our Go distribution installed at `/usr/local/opt/go`, this is the location of `GOROOT`.

> Setting the `GOROOT` variable should not be necessary in newer versions of Go.

Homebrew is also nice enough to provide a couple of **caveats** about the installation:

* One is about the `GOPATH` environment variable, which we'll cover in the next section.
* The other one is about adding something to our `PATH`. In a Hombrew's installation, the binaries are placed inside the `/usr/local/opt/go/libexec/bin/` folder. We have to add this folder to our `PATH` environment variable, so in our shell configuration file, (`.bash_profile` in OS X) we'll add:
```
export PATH=$PATH:/usr/local/opt/go/libexec/bin
```

To **uninstall** Go, we just have to run:
```
$ brew uninstall go
```

And delete any lines we added to our shell configuration file.

## Hello World
If everything went according to plan, we can confirm that Go is installed correctly by checking its version:
```
$ go version
go version go1.6 darwin/amd64
```

Now let's create a file named `hello.go` anywhere in your filesystem and add the following contents to it:
```go
package main

import "fmt"

func main() {
	fmt.Println("Hello, World!")
}
```

To run this file we'll do:
```
$ go run hello.go
Hello, World!
```

Here we are passing the `go` tool two arguments:

* The `run` command, which **compiles** and **runs** Go programs.
* The name of the program we want to run, in this case `hello.go`

The output is unsurprisingly, the text *Hello, World!*.

### Analizing our first program
Let's go over the `hello.go` code, line by line:

* The `package main` line is known as a **package declaration**. Every Go program must start with a package declaration. In this case, since this file will be the entry point of our app, it's going to be the main package.
* Next we have the `import "fmt"` line, where we are including code from the [fmt package][4] (shorthand for format), which contains formatting functions for input and output text.
* The last part is a **function declaration**. In this case we are declaring a function named `main`, which will be automatically called once our program is run. All function declarations have the following parts:

  * They start with the keyword `func`.
  * Followed by the **name of the function**, `main` in this case.
  * A list of zero or more **parameters** surrounded by parentheses.
  * An **optional** return type, which in this case doesn't exist.
  * And finally the **body** of the function, which is a block of code surrounded by curly braces.

  This function has no parameters, doesn't return anything and has only one statement. The name main is special because it's the function that gets called when you execute the program.

* Inside the **body** of our `main` function we have just **one statement**: `fmt.Println("Hello, World!")`. Here we are calling a function named [Println][5], which takes the string `"Hello, World!"` as an argument, and writes it to the **standard output**. Note that this function is prefixed with the name of the package where it is defined, the `fmt` package, which we imported before.

And that's it for now.

---
[:arrow_backward:][back] ║ [:house:][home] ║ [:arrow_forward:][next]

<!-- navigation -->
[home]: ../README.md
[back]: ../README.md
[next]: workspace.md


<!-- links -->
[1]: https://golang.org/doc/install
[2]: https://golang.org/dl/
[3]: http://brew.sh/
[4]: https://golang.org/pkg/fmt/
[5]: https://golang.org/pkg/fmt/#Println

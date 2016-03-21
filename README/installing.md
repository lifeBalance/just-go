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
Let's go over the `hello.go` program trying to explain what's going on. We can differentiate 3 main sections:

1. The **package declaration**. This is always the first thing at the top of each and every source code file. In Go, source code is organized into packages. A **package** consists of one or more files with the `.go` extension in a single directory. Each of these files begins with a package declaration which states the name of the package the file belongs to.

  In this case `package main` is special. It defines an **executable** program, not a library. If this file were part of a **library**, its package declaration would contain the name of the library.

2. Right after the package declaration follows the **import declaration**, in this case `import "fmt"`. This is where we tell the compiler what packages are needed by this source file, its dependencies. This program depends on a single package, the [fmt package][4] (shorthand for format), which contains functions for printing formatted text and scanning input text.

  Most of the times programs will import more than one package. We must import exactly the packages we intend to use. A program will not compile if there are missing imports or if there are unnecessary ones.

3. So far we have seen how the import declarations must follow the package declaration. After that, a program consists of the declarations of **functions**, **variables**, **constants** and **types**, preceded by the keywords `func`, `var`, `const` and `type`. In most of the cases, the order of the declarations in this section is not important.

  In this example we have a **function declaration**. We are declaring a function named `main`, which is a special function present on every `package main`. This function will be automatically called once our executable is run. All function declarations have the following parts:

  * They start with the **keyword** `func`.
  * Followed by the **name of the function**, `main` in this case.
  * A list of zero or more **parameters** surrounded by parentheses, which is always empty in the case of `main`.
  * An **optional** result list, which in this case doesn't exist.
  * And finally the **body** of the function, which is a block of code surrounded by curly braces.

  This function has no parameters, doesn't return anything and has only one statement. The name `main` is special because it's the function that gets called when you execute the program. Inside the **body** of our `main` function we have just **one statement**: `fmt.Println("Hello, World!")`. Here we are calling a function named [Println][5], which takes the string `"Hello, World!"` as an argument, and writes it to the **standard output**. Note that this function is prefixed with the name of the package where it is defined, the `fmt` package, which we define in our import declaration.

Go does not require **semicolons** at the ends of statements or declarations, except when two or more appear on the same line. At compile time, newlines following certain tokens are converted into semicolons. For example, the **opening brace** (`{`) of a function declaration must be on the same line of the declaration, not on a line by itself.

In Go, code formatting is very important, and the [gofmt][6] command applies the **standard format** to all the files in the specified package, or the ones in the current directory by default.

And that's it for this section.

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
[6]: https://golang.org/cmd/gofmt/

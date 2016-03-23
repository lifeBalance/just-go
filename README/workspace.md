# The Go Workspace
In the previous section we wrote our first *Hello, World!* program in **Go**. We didn't place it in any special place, and we were able to run it without any trouble. In other programming languages, every project lives independently in its own workspace, usually under its own version control repository.

Most Go programmers keep all their Go source code and dependencies in a **single workspace**.  The [workspace][1] is a directory hierarchy with three directories at its root:

* The `src` directory contains Go source files organized into **packages**. Each package goes on its own directory, which may contain several source files. The name of the folder will determine the name of the executable that will be generated.
* The `pkg` directory contains **package objects**. Package objects are compiled versions of the available **libraries** so the compiler can link against them without recompiling them. Package objects have the extension `.a`, wich is an intermediate format that is cached with the purpose of reducing compilation times, especially when we are pulling packages from remote repositories.
* The `bin` directory will contains the **executables** generated as a result of compiling our packages.

The `src` subdirectory typically contains multiple version control repositories (Git or Mercurial) that track the development of one or more source packages. The **go tool** builds source packages and installs the resulting binaries to the `pkg` and `bin` directories.

Let's create a workspace directory. Our workspace can be located wherever we like, but we’ll use `$HOME/code/go` in this example. Note that this must not be the same path as our Go installation:
```
$ mkdir $HOME/code/go
```

Now, inside this folder we'll create the three directories mentioned before:
```
$ cd $HOME/code/go
$ mkdir src pkg bin
```

## The GOPATH environment variable
The `GOPATH` environment variable specifies the location of your workspace. It is likely the only environment variable we’ll need to set when developing Go code. In the previous section we created our workspace, now we have to set the `GOPATH` variable accordingly, so let's add the following line to our `.bash_profile` configuration:
```
export GOPATH=$HOME/code/go
```

Don't forget to restart your terminal or source your shell configuration running:
```
$ source ~/.bash_profile
```

To check the variable is set we do:
```
$ echo $GOPATH
/Users/javi/code/go
```

Additionally and for convenience, we can also add the workspace’s `bin` subdirectory to our `PATH`, by adding the following line to our shell configuration:
```
export PATH=$PATH:$GOPATH/bin
```

The purpose of this is to be able of running our programs just by calling their names from anywhere in our filesystem. For example, if we had a **package** named `foo` in our `$GOPATH/src`, we could run it doing:
```
$ go run foo
```

## Packages
In Go, all the source code is organized into **packages**, and we have to organize these packages in our workspace. But what are packages, and what is their purpose? In a previous section, when we were dissecting our *Hello, World!* program, we mentioned the [fmt package][2]. This is a a package that belongs to the [Standard Library][3], and includes a variety of functions related to formatting text for input and output. So we can say that the main purpose of a package is to bundle code into a single unit, what offers several benefits:

* A package provides a **namespace** for functions, reducing the chances of having functions with overlapping names. For example, we saw before the `fmt.Println` function, we may also create another function with the same name but in another package, `foo.Println` avoiding overlapping names.
* It helps organizing our code, so it's easier to find what we're looking for.

### Organizing our packages
Inside our workspace, the `src` folder exists to store all of our packages. We can even organize these packages into subfolders. For example, let's create a directory for keeping packages which we have no intention to publish, and call it `local_packages`:
```
$ cd $GOPATH/src
$ mkdir local_packages
```

### Creating our first package
To learn how to create a package, we are going to use the `hello.go` program we wrote in the previous section. So first of all, we'll create a folder for the package, and name it `hello`:
```
$ cd local_packages
$ mkdir hello
```

Inside this folder we'll put all of the source files that our program needs to run, in this case we have only one. The name of this folder will be used to name the generated executable, once the package (the contents of the folder) is compiled. The name of the package (name of the folder) is important, and you can learn a lot about it in this [post at blog.golang.org][4], but for the moment it's enough to remember that:

* Good package names are **short** and clear.
* They are **lower case**, with no under_scores or mixedCaps.
* They are often simple nouns, such as `hello`.

Now we'll move our `hello.go` file inside the `hello` folder. Regarding the **file name**, we could keep it the same name as the package, but remember that it's the name of the folder what determines the name of the future executable. Also, since this file is the entry point of our app, and contains the main package, it seems like a better idea to rename it to `main.go`. So this is the result:
```
$ tree src/local_packages/ -L 2
src/local_packages/
└── hello
    └── main.go
```

Now we are ready to change into this directory and compile our program:
```
$ cd src/local_packages/hello
$ go install
```

This command doesn't generate any output, but if we change into the `$GOPATH/bin` folder, we should see our `hello` executable right there. We can run this executable file from anywhere in our filesystem, thanks to having added the workspace’s `bin` subdirectory to our `PATH`. So wherever you are just type:
```
$ hello
Hello, World!
```

### Creating our own libraries
Let’s write a **library** and use it in the `hello` program. The first step is to choose a name and a location for the package in our workspace. We’ll name it `stringutil` and we'll place it in the `local_projects/` folder:
```
$ mkdir $GOPATH/src/local_packages/stringutil
$ cd $GOPATH/src/local_packages/stringutil
$ touch reverse.go
```

Now let's edit the `reverse.go` file with the following contents:
```go
// Package stringutil contains utility functions for working with strings.
package stringutil

// Reverse returns its argument string reversed rune-wise left to right.
func Reverse(s string) string {
	r := []rune(s)
	for i, j := 0, len(r)-1; i < len(r)/2; i, j = i+1, j-1 {
		r[i], r[j] = r[j], r[i]
	}
	return string(r)
}
```

Now, test that the package compiles with go build:
```
$ go build local_packages/stringutil
```

Or, if we are working inside the `stringutil` directory, just:
```
$ go build
```

This won’t produce an output file, but the absence of errors will mean we can install it. To do that, you must use `go install`, which places the package object inside the `pkg` directory of the workspace:
```
$ go install local_packages/stringutil
```

As a result, a new directory will appear with the following contents:
```
$ tree pkg/ -L 3
pkg/
└── darwin_amd64
    └── local_packages
        └── stringutil.a
```

We get a new `darwin_amd64` directory that reflects the operating system and architecture of our OS. The purpose of this directory is to aid when cross-compiling for other Operating systems. Inside it we get the `stringutil.a` **package object** inside a folder structure that mirrors its source directory.

## Using a library
Creating our own library only makes sense when we want to package some code to be reused by other executable code. So in order to use the library we have created, let's create a new `helloreverse` package:
```Go
package main

import (
  "fmt"
  "local_packages/stringutil"
)

func main() {
	fmt.Println(stringutil.Reverse("Hello, World!"))
}
```

Note how when we want to import several packages, we put the in separate lines and wrap them in parentheses. Now, from our `$GOPATH` directory we can install the new executable:
```
$ go install local_packages/helloreverse
```

Whenever the go tool installs a package or binary, it also installs whatever **dependencies** it has. So when you install the `helloreverse` program, the `stringutil` package will be installed as well, automatically.

And we can also run it from anywhere in our filesystem:
```
$ helloreverse
!dlroW ,olleH
```

## Import paths
In our `helloreverse` we used the string `"local_packages/stringutil"` when importing our `stringutil` library. This string is known as an **import path**, meaning the location of a package inside a workspace or in a remote repository.

> An **import path** is a string that uniquely identifies a package.

If we keep our code in a source repository somewhere, then we should use the root of that source repository as the base path when importing packages. For instance, I intend to publish some code to [my github repository][4], so I'll create the following folder:
```
$ mkdir -p $GOPATH/src/github.com/lifeBalance
```

And for all the packages I keep under version control there, `github.com/lifeBalance` will be the base path, for example, this is how I would import a library named `foo`:
```Go
import "github.com/lifeBalance/foo"
```

Note that we don't need to publish your code to a remote repository before you can build it. In fact, we don't even have to initialize a Git repo for our code, but it's just a good habit to organize your code as if you will publish it someday.

### Fetching remote packages
Most of the times, the **import path** describes how to obtain the package source code using a revision control system such as Git or Mercurial. The **go tool** uses this property to automatically fetch packages from these remote repositories. For example, if we had the following line in our executable:
```Go
import "github.com/foobar/foo"
```

The `go` tool would fetch, build, and install it automatically. We could fetch these packages manually using `go get` ourselves:
```
$ go get github.com/foobar/foo
```

Most of the times we don't need to do that, but it's nice to know that behind the curtains the `go get` command is being used to fetch remote libraries.

## Summary
In this section we have explored how to organize our source code when programming in the Go ecosystem. We've learned about:

* The Go workspace and the `GOPATH` environment variable.
* What is a package, and how we can create one.
* There are two types of packages: executable and libraries.
* How the go tool automatically fetch remote packages using its import paths.

This section is based mostly on the article [How to Write Go Code][5] that you can find in the golang documentation.

---
[:arrow_backward:][back] ║ [:house:][home] ║ [:arrow_forward:][next]

<!-- navigation -->
[home]: ../README.md
[back]: installing.md
[next]: lexical_elements.md


<!-- links -->
[1]: https://golang.org/doc/code.html#Workspaces
[2]: https://golang.org/pkg/fmt/
[3]: https://golang.org/pkg/#stdlib
[4]: https://github.com/lifeBalance
[5]: https://golang.org/doc/code.html

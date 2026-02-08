# Installing Go

[Go](https://go.dev) is a **compiled language**, meaning that we need to use a compiler to transform our source code into machine code that the computer can run.

## Download and Install

The Go official site contains instructions for [downloading and installing](https://go.dev/doc/install) the Go compiler, for all major platforms (Linux, MacOs and Windows). Basically you **download a binary**, click on it and follow the instructions to **install it**. At the end of it, you should be able of running:

```sh
go version
```

The output would depend on the version of the compiler you downloaded; at the time of writing this I got:

```sh
go version go1.25.4 darwin/arm64
```

## Using a Package Manager

Instead of downloading and installing manually the official binary, you could use the package manager of your choice.

<Admonition>
Some examples of package managers are [Chocolatey](https://chocolatey.org/) for **Windows** 🤢, or if you're on **Linux** 👍, you probably know how to use a package manager.
</Admonition>

In **macOS**, we can install the Go compiler using [homebrew](https://brew.sh/) (a popular package manager for macOS):

```
brew install go
```

At the end of it, you should be able of running `go version` and get some output.

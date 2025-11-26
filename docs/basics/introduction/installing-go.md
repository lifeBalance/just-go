# Installing Go

[Go](https://go.dev) is a **compiled language**, meaning that we need to use a compiler to transform our source code into machine code that the computer can run.

## Download and Install

The Go official site contains instructions for [downloading and installing](https://go.dev/doc/install) the Go compiler, in all major platforms (Linux, MacOs and Windows).

Basically you download a binary, click on it and follow the instructions. At the end of it, you should be able of running:

```
go version
```

## Using a Package Manager

In MacOs, we can install the Go compiler using [homebrew](https://brew.sh/) (a macOS package manager):

```
brew install go
```

At the end of it, you should be able of running:

```
go version go1.25.4 darwin/arm64
```

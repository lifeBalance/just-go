# The Go Debugger

The [Go docs](https://go.dev/doc) have a section about [debugging with GDB](https://go.dev/doc/gdb). They start with the disclaimer that [Delve](https://github.com/go-delve/delve) is a better alternative, so guess which one we'll be using.

## Installing Delve

There are several ways of [installing Delve](https://github.com/go-delve/delve/tree/master/Documentation/installation):

- As a Go package:

```sh
go install github.com/go-delve/delve/cmd/dlv@latest
```

- Or if you're in macOs, with [brew](https://formulae.brew.sh/formula/delve):

```sh
brew install delve
```

Once installed, make sure you can run:

```sh
dlv --help
```

## VsCode

The Golang repo in GitHub, includes a useful section about [debugging Go in VSCode](https://github.com/golang/vscode-go/wiki/debugging#launchjson-attributes)
# API

In this section we'll explain how the logic for reading/parsing the Markdown and MDX files works.

## The Entry Point

The entry point is the **dynamic route** in `pages/[section]/[...page].astro`. This is what happens in this file:

1. The first thing we have is an `export` statement of the [getStaticPaths](https://docs.astro.build/en/reference/errors/get-static-paths-required/) function, which is required for [dynamic routes](https://docs.astro.build/en/guides/routing/#dynamic-routes).
2. Then we call `resolveOrNext`, which is a function for ... ; if the result `kind` is the string `redirect`, we invoke Astro's [redirect]() method, to redirect the user to the `result.url`.


## The `lib/docs` folder

The API offered by the code in the `lib/docs` folder is organized in the following files:

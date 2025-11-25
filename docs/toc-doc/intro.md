# Getting Started

This project uses Astro in SSG mode, to support a documentation site with multiple sections. Each section is independent from each other, and gets its own **table of content**. The use case for this, was to be able of grouping related subjects in a learning path. For example, I wanted to get deep into the Go programming language, so organizing all topics into a single table of contents, was gonna become unwieldy quite fast. Instead, I wanted to be able to land in a page, where I could click on any of the cards, which support different topics:

- Basics.
- Concurrency.
- Design patterns.
- Etc.

The existing [Starlight](https://starlight.astro.build/) project didn't fit my use case, since (at the time of writing this) it only supported a single content collection.

> [!NOTE]
> I called it **toc-doc** because the table of contents was the main thing to keep the content organized.

## How to use it

The idea is that the user, can drop Markdown or MDX files in subfolders under the `/docs` folder. Using `_toc.ts` files, the order of the items in the sidebar can be controlled. Documents can be added:

- In subfolders, with their own `_toc.ts` files.
- As single documents, which order can be controlled with a `_toc.ts` file.

There are two main routes:

- The landing page is handled by the `pages/index.astro` file. Here it's where the users should add links to each section of the `/docs` folder.
- There's also a **dynamic route** in `pages/[section]/[...page].astro` that automatically picks up all the subfolders under the `/docs` directory.

Users can also add their own custom routes, as I did with the `colors.astro`, which is a page where I could render the colors used in my dark and light themes, to see how they looked like.
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

- The landing page is handled by the `pages/index.astro` file. Cards on this page are now generated from the sections you declare in `docsIntegration()` inside `astro.config.mjs`, including optional metadata like `title`, `subtitle`, and `href`.
- There's also a **dynamic route** in `pages/[section]/[...page].astro` that automatically picks up all the subfolders under the `/docs` directory.

Users can also add their own custom routes, as I did with the `colors.astro`, which is a page where I could render the colors used in my dark and light themes, to see how they looked like.

## Example Folder Structure

A minimal section under `/docs` might look like this:

```
/docs/
  basics/
    _toc.ts
    getting-started.md
    variables/
      _toc.ts
      intro.md
      scope.md
```

- `/docs/basics/_toc.ts` controls the order at the section root. There are two types of items:
    1. Items ending with `/` denote **groups** (rendered in the sidebar using an accordion component)
    2. Items without `/` denote single docs.
- `/docs/basics/variables/_toc.ts` controls the order inside the `variables` group.
- Files not listed in `_toc.ts` are ignored in the sidebar/navigation.

## Dynamic Route Behavior

The dynamic route lives at `src/pages/[section]/[...page].astro`.

- Visiting `/{section}` (no page segment): the router redirects to the first listed item of that section, based on `/docs/{section}/_toc.ts`.
- Visiting `/{section}/{group}` (one segment): the router redirects to the first listed item of that group, based on `/docs/{section}/{group}/_toc.ts`.
- Visiting `/{section}/{slug}` (full path to a document): the MD/MDX module is resolved and rendered.

This behavior ensures users always land on a concrete document — never an empty placeholder — while keeping ordering and labels driven entirely by your `_toc.ts` files.

## Add a New Section

1. Create the section folder under `/docs`:
   - `/docs/<section>/`
2. Add a `_toc.ts` to control ordering and labels:
   ```ts
   // /docs/<section>/_toc.ts
   export default [
     { path: 'introduction/', label: 'Introduction' }, // group
     { path: 'getting-started', label: 'Getting Started' }, // single doc
   ]
   ```
   - Groups end with `/`; items don’t.
   - Omitted files won’t show up in the sidebar or prev/next.
3. Add your content files in Markdown or MDX:
   - At the section root: `/docs/<section>/getting-started.md`
   - Inside groups: `/docs/<section>/introduction/overview.mdx`
   - Optionally add `_toc.ts` per group to control item order within that folder.
4. Optional: Use `index.mdx`
   - Placing `index.mdx` in a folder maps that folder to the folder’s URL (e.g., `/docs/<section>/intro/index.mdx` → `/<section>/intro`).
5. Optional: Set a title via frontmatter
   - If present (`metadata.title`), it’s used for display; otherwise title is derived from the filename/folder.
6. Link the section from the landing page
   - Add a card/link to `/<section>` in `src/pages/index.astro`.
7. Verify redirects
   - Navigate to `/<section>` → should redirect to the first `_toc.ts` entry.
   - Navigate to `/<section>/<group>` → should redirect to the first listed item for that group.

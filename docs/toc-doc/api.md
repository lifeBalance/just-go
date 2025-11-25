# API

This section documents how the documentation system:

- Discovers content.
- Builds the navigation (sidebar and page buttons).
- Resolves pages.
- And computes prev/next links.

The implementation is intentionally framework‑lean and lives under `src/lib/docs`. Content is read from `/docs/**`.

## Entry Point: Dynamic Route

- File: `src/pages/[section]/[...page].astro`
- Responsibilities:
  - Generate static paths for all docs via `listSectionPageParams()`.
  - For each request, construct a section API with `createSection(section)`.
  - Resolve the current segment with `resolveOrNext(sectionApi, segment)`.
  - Render the MD/MDX module’s default export when resolved.
  - Compute prev/next page links with `getPrevNext(nav, currentPath)`.

## Static Paths

- Function: `listSectionPageParams()`
- File: `src/lib/docs/paths.ts`
- Behavior:
  - Globs `/docs/**/*.{md,mdx}` eagerly.
  - Maps file paths to route-like paths (e.g., `/docs/basics/intro.md` → `/basics/intro`).
  - Produces `{ section, page }` for each non-root doc.
  - Adds a synthetic entry for each section root with `page: ''` so the route can handle `/{section}`.

## Section API

- Factory: `createSection(section)`
- File: `src/lib/docs/section.ts`
- Exposes:
  - `base`: the section’s base route (e.g., `"/basics"`).
  - `entries()`: list of content entries for the section.
  - `resolver()`: function that maps a `segment` like `"variables/intro"` to a compiled MD/MDX module.
  - `nav()`: builds the sidebar/navigation for the section from `_toc.ts` files.

### Entries

- Built by: `createContentEntries(mods, base)`
- File: `src/lib/docs/content.ts`
- For each MD/MDX module:
  - `url`: public route (e.g., `"/basics/variables/intro"`).
  - `dir`: parent directory relative to the section base.
  - `title`: taken from `mod.metadata.title` when available, else derived from file/folder name (with a fallback for `index.mdx`).
  - `isIndex`: `true` when the source file is `index.md|mdx`.

### Resolver

- Factory: `makeResolver(mods, base)`
- File: `src/lib/docs/resolver.ts`
- Creates a map from normalized route (e.g., `"/basics/intro"`) to the corresponding compiled MD/MDX module.
- Returned function signature: `(segment: string) => MdModule | undefined`.
- Used by the page to render `<Page />` where `Page = mod?.default`.

### Navigation (Sidebar)

- Drive navigation with `_toc.ts` files placed at the section root and inside groups.
- Parser: `parseSidebarConfig(raw)`
- File: `src/lib/docs/sidebar.ts`
- Rules:
  - `_toc.ts` exports an array of entries. Each entry can be:
    - A string path.
    - An object `{ path: string; label?: string; hidden?: boolean }`.
  - Group vs item:
    - Paths ending with `/` are groups (e.g., `"introduction/"`).
    - Paths without trailing `/` are single docs (e.g., `"getting-started"`).
  - `label` provides an alias for sidebar display.
  - `hidden: true` excludes a group or item from the sidebar and from prev/next.
  - Files not listed in `_toc.ts` are ignored for navigation order.

## Routing Logic

- File: `src/lib/docs/routing.ts`
- `resolveOrNext(section, segment)` decides what to do with the current URL segment:
  - `ok`: the resolver found a module for the segment → render it.
  - `redirect`: send the user to the first item of the section or group.
    - Visiting `/{section}` (no segment) redirects to the first listed item from `/docs/{section}/_toc.ts`.
    - Visiting `/{section}/{group}` (one segment) redirects to the first listed item from `/docs/{section}/{group}/_toc.ts`.
  - `not_found`: neither the segment nor its first item exists.

### Prev/Next Links

- Function: `getPrevNext(nav, currentPath)`
- File: `src/lib/docs/routing.ts`
- Flattens the navigation (respecting the order produced from `_toc.ts`) and derives the immediate previous and next items relative to `currentPath`.
- Only items present in the final navigation (i.e., not hidden, and listed) participate in prev/next.

## Path Utilities

- File: `src/lib/docs/paths.ts`
- `fsPathToRoute(fsPath)`: converts a source file path under `/docs` to a public route (removes `/docs` prefix and markdown extensions; `index.md|mdx` drops the filename).
- `normalizePath(path)`: removes trailing slashes for consistent matching.

## Putting It Together

1. Build-time: `getStaticPaths()` calls `listSectionPageParams()` to enumerate all `{ section, page }` pairs and create static routes, including `page: ''` for section roots.
2. Runtime (for each static path):
   - Create a section API via `createSection(section)`.
   - `resolveOrNext()` either resolves a module for `segment` or redirects to the first listed item when the user is at a section root or group root.
   - Render the resolved MD/MDX component’s default export.
   - Compute prev/next with `getPrevNext()` for navigation at the bottom of the page.

## Authoring Notes

- Add or reorder items by editing `_toc.ts` at the section root and per-group folders.
- Use `label` to set friendly names; otherwise, titles come from `mod.metadata.title` or a filename-derived fallback.
- Place `index.md|mdx` inside a folder to map that folder’s URL to the index document (e.g., `intro/index.mdx` → `/<section>/intro`).
- Non-listed files are still routable (if linked directly) but won’t appear in the sidebar or prev/next unless listed.

# API

This document explains how the docs engine discovers content, builds navigation, resolves pages, and computes prev/next links. The implementation is colocated in `src/lib/docs/section.ts`, with a small `_toc.ts` parser in `src/lib/docs/sidebar.ts`. All content lives under `/docs/**`.

## Overview
- Content source: Markdown/MDX files in `/docs/<section>/**`
- Ordering and labels: `_toc.ts` at the section root and per group
- Routes: `src/pages/[section]/[...page].astro` renders docs with `createSection()`
- Static paths: generated via `getDocStaticPaths()`
- Redirects: section/group roots redirect to the first listed item
- Prev/next: based on the flattened, ordered nav

## Authoring
- Place docs under `/docs/<section>`
- Control order/labels/visibility via `_toc.ts`:
  - Strings: `'group/'` or `'slug'`
  - Objects: `{ path: 'group/', label?: string, hidden?: boolean }`
  - Groups must end with `/`; items must not
  - Hidden entries are excluded from the sidebar and prev/next
- Titles come from `metadata.title` when present; otherwise derived from file/folder name
- `index.md|mdx` inside a folder maps that folder’s URL (e.g., `intro/index.mdx` → `/<section>/intro`)

## Routing Entry
- File: `src/pages/[section]/[...page].astro`
- Responsibilities:
  - `getStaticPaths()` → `getDocStaticPaths()`
  - Build section API: `const sectionApi = createSection(section)`
  - Resolve or redirect: `const result = resolveOrNext(sectionApi, segment)`
  - Render content: `const Page = sectionApi.resolver()(segment)?.default`
  - Prev/next links: `getPrevNext(result.nav, currentPath)`

## Public API (section.ts)
- `getDocStaticPaths(): Array<{ params: { section: string; page?: string } }>`
  - Generates static paths for all docs by scanning `/docs/**`
- `listSectionPageParams(): Array<{ section: string; page?: string }>`
  - Underpins `getDocStaticPaths()`; includes section root entries without `page`
- `createSection(section: string)` → `{ base, entries(), resolver(), nav() }`
  - `base`: section base URL (e.g., `'/basics'`)
  - `entries(): Array<{ url, title, isIndex }>`
    - Derived from MD/MDX modules; title uses `metadata.title` when present
  - `resolver(): (segment: string) => MdModule | undefined`
    - Maps `segment` (e.g., `'variables/intro'`) to the compiled MD/MDX module
  - `nav(): { nav: NavGroup[] }`
    - Builds sidebar based on `_toc.ts` at the section root and per group
- `resolveOrNext(sectionApi, segment)`
  - `ok`: page resolves → render it
  - `redirect`: section or group root → first listed item
  - `not_found`: neither the segment nor first item exists
- `getPrevNext(nav, currentPath)`
  - Returns `{ prev?: { url, title }, next?: { url, title } }` using flattened, ordered nav

## `_toc.ts` Details (sidebar.ts)
- File: `src/lib/docs/sidebar.ts`
- Shape: `Array<string | { path: string; label?: string; hidden?: boolean }>`
- Rules:
  - Group vs item: trailing `/` denotes a group
  - `label` overrides display name; `hidden: true` removes entry from nav
  - Not-listed files remain routable but won’t appear in nav/prev-next

## Path Mapping
- Implemented in `section.ts`
- `fsPathToRoute('/docs/basics/intro.md')` → `'/basics/intro'`
- `fsPathToRoute('/docs/basics/introduction/index.mdx')` → `'/basics/introduction/'`
- `normalizePath('/basics/intro/')` → `'/basics/intro'`

## Flow Summary
1. Build-time: `getStaticPaths()` returns `getDocStaticPaths()`
2. Runtime:
   - `createSection(section)` → `entries()`, `resolver()`, `nav()`
   - `resolveOrNext()` returns `ok | redirect | not_found`
   - Render `Page = resolver()(segment)?.default`
   - Compute prev/next with `getPrevNext()`

## Example Usage
- Route file: `src/pages/[section]/[...page].astro`
  - `export async function getStaticPaths() { return getDocStaticPaths() }`
  - `const { section, page } = Astro.params as { section: string; page?: string | string[] }`
  - `const segment = Array.isArray(page) ? page.join('/') : page || ''`
  - `const api = createSection(section)`
  - `const result = resolveOrNext(api, segment)`
  - `const Page = api.resolver()(segment)?.default`
  - `const { prev, next } = getPrevNext(result.nav, currentPath)`

This design keeps the docs engine small and explicit: `_toc.ts` controls ordering and labels; content stays in `/docs/**`; and the page renders a resolved MDX component with consistent navigation.

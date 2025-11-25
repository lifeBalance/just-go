# API

This page documents the docs engine that powers the dynamic route at `src/pages/[section]/[...page].astro`. The implementation lives in `src/lib/docs/section.ts` with a small `_toc.ts` parser in `src/lib/docs/tocParser.ts`. All content lives under `/docs/**`.

The format below is one section per function. Each includes a short purpose, signature, a concrete example (input/output), and — where relevant — why the function must stay in the codebase.

> Repo context used for the examples:
>
> - Sections: `basics/`, `toc-doc/`
> - `_toc.ts` files exist at: `/docs/basics/_toc.ts`, `/docs/basics/introduction/_toc.ts`, `/docs/basics/variables/_toc.ts`, `/docs/toc-doc/_toc.ts`
> - Example docs (abridged):
>   - `/docs/basics/introduction/hello-world/index.mdx`
>   - `/docs/basics/introduction/lorem.md`
>   - `/docs/basics/introduction/overview.mdx`
>   - `/docs/basics/variables/intro.md` (frontmatter title: `Intro`)
>   - `/docs/basics/variables/scope.md` (frontmatter title: `Scope`, hidden via `_toc.ts`)
>   - `/docs/toc-doc/intro.md`, `/docs/toc-doc/api.md`

## getDocStaticPaths

- Signature: `getDocStaticPaths(): Array<{ params: { section: string; page?: string } }>`
- Purpose: Produce all static paths for the docs route (used by `getStaticPaths()` in the dynamic page).
- Why it stays: Keeps route generation isolated from the page; the page remains small and declarative.

Example output (abridged, order not guaranteed):

```ts
getDocStaticPaths()
// => [
//   { params: { section: 'basics', page: 'introduction/hello-world' } },
//   { params: { section: 'basics', page: 'introduction/lorem' } },
//   { params: { section: 'basics', page: 'introduction/overview' } },
//   { params: { section: 'basics', page: 'variables/intro' } },
//   { params: { section: 'basics', page: 'variables/scope' } },
//   { params: { section: 'basics' } },
//   { params: { section: 'toc-doc', page: 'intro' } },
//   { params: { section: 'toc-doc', page: 'api' } },
//   { params: { section: 'toc-doc' } },
// ]
```

## listSectionPageParams

- Signature: `listSectionPageParams(): Array<{ section: string; page?: string }>`
- Purpose: Enumerate all `{section, page?}` combinations by scanning `/docs/**`.
- Why it stays: It is the source of truth for static path derivation and may be useful for other tooling (e.g., sitemap generation).

Example output (abridged, order not guaranteed):

```ts
listSectionPageParams()
// => [
//   { section: 'basics', page: 'introduction/hello-world' },
//   { section: 'basics', page: 'introduction/lorem' },
//   { section: 'basics', page: 'introduction/overview' },
//   { section: 'basics', page: 'variables/intro' },
//   { section: 'basics', page: 'variables/scope' },
//   { section: 'basics' },
//   { section: 'toc-doc', page: 'intro' },
//   { section: 'toc-doc', page: 'api' },
//   { section: 'toc-doc' },
// ]
```

## createSection

- Signature: `createSection(section: string): { base, entries(), resolver(), nav() }`
- Purpose: Build a section-specific API used by the route — enumerates content, resolves modules, and builds navigation.
- Why it stays: Keeps all section logic encapsulated and testable; the route uses a tiny, predictable surface.

### `.base`

- Example:

```ts
createSection('basics').base
// => '/basics'
```

### `.entries()`

- Returns: `Array<{ url: string; title: string; isIndex: boolean }>`
- Notes: `title` comes from `metadata.title` (frontmatter) when present, else falls back to filename/folder. For `index.mdx`, the fallback is the folder path relative to the section.

Example:

```ts
createSection('basics').entries()
// => [
//   { url: '/basics/introduction/hello-world', title: 'introduction/hello-world', isIndex: true },
//   { url: '/basics/introduction/lorem',       title: 'lorem',                   isIndex: false },
//   { url: '/basics/introduction/overview',    title: 'overview',                isIndex: false },
//   { url: '/basics/variables/intro',          title: 'Intro',                   isIndex: false },
//   { url: '/basics/variables/scope',          title: 'Scope',                   isIndex: false },
// ]
```

### `.resolver()`

- Returns: `(segment: string) => MdModule | undefined`
- Purpose: Resolve a `segment` like `'variables/intro'` to the compiled MD/MDX module.

Example:

```ts
const api = createSection('basics')
const resolve = api.resolver()
resolve('variables/intro')   // => MdModule (truthy)
resolve('variables/missing') // => undefined
```

### `.nav()`

- Returns: `{ nav: NavGroup[] }` where `NavGroup = { dir, label, href?, items: Array<{ url, title }> }`
- Notes: Uses `_toc.ts` at the section root and inside groups; hidden entries are excluded; group labels come from the root `_toc.ts` alias; item labels from the group’s `_toc.ts` alias or the entry title.

Example for `basics`:

```ts
createSection('basics').nav()
// => {
//   nav: [
//     {
//       label: 'Introduction',
//       dir: 'introduction',
//       items: [
//         { url: '/basics/introduction/hello-world', title: 'Hello World' },
//         { url: '/basics/introduction/lorem',       title: 'Lorem chipsum' },
//         { url: '/basics/introduction/overview',    title: 'Overview' },
//       ],
//     },
//     {
//       label: 'Variables',
//       dir: 'variables',
//       items: [
//         { url: '/basics/variables/intro', title: 'Intro to Vars' },
//         // '/basics/variables/scope' is hidden → omitted
//       ],
//     },
//   ],
// }
```

## resolveOrNext

- Signature: `resolveOrNext(sectionApi, segment): ResolveResult`
- Purpose: Decide what to do for a given `segment`: render (`ok`), redirect to the first listed item (`redirect`), or show `not_found`.
- Why it stays: Centralizes routing behavior including the UX guarantee that landing on a section or group goes to a concrete page.

Examples (for `basics`):

```ts
const api = createSection('basics')

resolveOrNext(api, '')
// => { kind: 'redirect', url: '/basics/introduction/hello-world', nav: [...] }

resolveOrNext(api, 'variables')
// => { kind: 'redirect', url: '/basics/variables/intro', nav: [...] }

resolveOrNext(api, 'variables/missing')
// => { kind: 'not_found', nav: [...] }
```

## getPrevNext

- Signature: `getPrevNext(nav: NavGroup[], currentPath: string): { prev?: { url, title }, next?: { url, title } }`
- Purpose: Compute prev/next links from the flattened, ordered navigation structure.
- Why it stays: Provides consistent keyboard/link navigation without the page needing to know about ordering rules.

Example:

```ts
const { nav } = createSection('basics').nav()
getPrevNext(nav, '/basics/introduction/lorem')
// => {
//   prev: { url: '/basics/introduction/hello-world', title: 'Hello World' },
//   next: { url: '/basics/introduction/overview',    title: 'Overview' }
// }
```

## parseTocConfig (tocParser.ts)

- File: `src/lib/docs/tocParser.ts`
- Signature: `parseTocConfig(raw: unknown): { ordered, alias, hidden }`
- Purpose: Parse a `_toc.ts` export into a normalized structure: the ordered list, label overrides (`alias`), and hidden entries.
- Why it stays: Keeps all `_toc.ts` flexibility (strings or objects; groups vs items) behind a single normalized representation used everywhere else.

Examples:

```ts
parseTocConfig([
  { path: 'intro',  label: 'Intro to Vars' },
  { path: 'scope',  label: 'Scope', hidden: true },
])
// => {
//   ordered: [
//     { path: 'intro', label: 'Intro to Vars' },
//     { path: 'scope', label: 'Scope', hidden: true },
//   ],
//   alias:  Map { 'intro' => 'Intro to Vars', 'scope' => 'Scope' },
//   hidden: Set { 'scope' },
// }

parseTocConfig([
  { path: 'introduction/', label: 'Introduction' },
  { path: 'variables/',    label: 'Variables' },
])
// => {
//   ordered: [
//     { path: 'introduction/', label: 'Introduction' },
//     { path: 'variables/',    label: 'Variables' },
//   ],
//   alias:  Map { 'introduction/' => 'Introduction', 'variables/' => 'Variables' },
//   hidden: Set {},
// }
```

## Internal Helpers (kept)

These are not exported from the modules’ public surface, but are essential to the implementation. They stay to keep behavior robust and centralized.

- Path utilities (in `section.ts`): `normalize`, `trimSlashes`, `isGroup`, `fsToRoute`, `toRelative`, `getParts`
  - Why: Single source of truth for all path manipulations across filesystem paths and route URLs.
- ContentStore (in `section.ts`)
  - Why: Caches the results of `import.meta.glob` for both docs and `_toc` files and exposes section-scoped queries.
- `flattenNav` and `categorizeEntries` (in `section.ts`)
  - Why: Provide efficient, predictable transformations for navigation and lookups without leaking details into the route.

## Routing Entry (how to use the API)

- File: `src/pages/[section]/[...page].astro`
- Responsibilities:
  - `getStaticPaths()` → `getDocStaticPaths()`
  - Build section API: `const api = createSection(section)`
  - Resolve or redirect: `const result = resolveOrNext(api, segment)`
  - Render content: `const Page = api.resolver()(segment)?.default`
  - Prev/next links: `const { prev, next } = getPrevNext(result.nav, currentPath)`

Example usage:

```ts
export async function getStaticPaths() {
  return getDocStaticPaths()
}

const { section, page } = Astro.params as { section: string; page?: string | string[] }
const segment = Array.isArray(page) ? page.join('/') : page || ''

const api = createSection(section)
const result = resolveOrNext(api, segment)
const Page = api.resolver()(segment)?.default
const { prev, next } = getPrevNext(result.nav, result.kind === 'ok' ? `/${section}/${segment}` : result.kind === 'redirect' ? result.url : '')
```

This organization keeps the page minimal while the docs engine remains explicit and predictable: `_toc.ts` files control ordering and labels; content stays in `/docs/**`; and resolved MDX components render with consistent navigation and sensible redirects.

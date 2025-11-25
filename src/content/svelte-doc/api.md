# API

- `createSection(section: string)` → `{ base, entries(), resolver(), orderIndex(), nav() }`
- `createContentEntries(mods, base)` → `ContentEntry[]`
- `createOrderIndex(mods, fullPath)` → `Map<string, number>`
- `createNav(entries, base, orderIndex)` → `{ nav: NavGroup[] }`
- `makeResolver(mods, base)` → `(segment) => MdModule | undefined`

Types
- `ContentEntry { url, dir, title, isIndex, mod }`
- `NavItem { url, title, weight }`
- `NavGroup { dir, label, href?, items }`

```ts
console.log('hello world')
```

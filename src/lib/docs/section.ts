import { createContentEntries } from './content'
import { makeResolver, type MdModule } from './resolver'
import type { ContentEntry, NavGroup } from './types'
import { parseSidebarConfig, type SidebarConfig } from './sidebar'

// Glob all content once; filter by section at runtime
const allMods = import.meta.glob('/src/content/**/*.md', {
  eager: true,
}) as Record<string, MdModule>
// Glob all sidebars once; filter by section path
const allSidebars = import.meta.glob('/src/content/**/_sidebar.json', {
  eager: true,
}) as Record<string, any>

function filterMods(section: string): Record<string, MdModule> {
  const sec = section.replace(/^\/+|\/+$/g, '')
  const prefix = `/src/content/${sec}/`
  return Object.fromEntries(
    Object.entries(allMods).filter(([fs]) => fs.startsWith(prefix)),
  )
}

function readSidebar(fsPath: string): SidebarConfig {
  const mod = allSidebars[fsPath]
  const raw = mod?.default ?? null
  return parseSidebarConfig(raw)
}

function capitalize(name: string) {
  return name.replace(/(^|\/)\w/g, (m) => m.toUpperCase())
}

export function createSection(section: string) {
  const sec = section.replace(/^\/+|\/+$/g, '')
  const base = `/${sec}`
  const contentRoot = `/src/content/${sec}`
  const mods = filterMods(section)
  return {
    base,
    entries(): ContentEntry[] {
      return createContentEntries(mods, base)
    },
    resolver() {
      return makeResolver(mods, base)
    },
    nav(): { nav: NavGroup[] } {
      const entries = this.entries()

      // Determine top-level groups (first path segment after base)
      const groupSet = new Set<string>()
      for (const e of entries) {
        const rel = e.url.replace(new RegExp('^' + base + '/'), '')
        const parts = rel.split('/').filter(Boolean)
        if (parts.length >= 1) groupSet.add(parts[0])
      }
      const groups = Array.from(groupSet)

       // Parent (root) sidebar for ordering, alias, hidden
       const rootSidebar = readSidebar(`${contentRoot}/_sidebar.json`)
       const rootAlias = rootSidebar.alias
       const rootHidden = rootSidebar.hidden

       // Collect top-level docs (files directly under the section)
       const topDocs: Map<string, ContentEntry> = new Map()
       for (const e of entries) {
         const rel = e.url.replace(new RegExp('^' + base + '/'), '')
         const parts = rel.split('/').filter(Boolean)
         if (parts.length === 1 && !e.isIndex) {
           topDocs.set(parts[0], e)
         }
       }

       // Helper: build a group NavGroup for folder 'g'
       function buildGroup(g: string): NavGroup | null {
         const groupKey = `${g}/`
         if (rootHidden.has(groupKey)) return null

         // Collect direct items within this group (one level deep)
         const items = entries.filter((e) => {
           const rel = e.url.replace(new RegExp('^' + base + '/'), '')
           const parts = rel.split('/').filter(Boolean)
           return parts[0] === g && parts.length === 2 && !e.isIndex
         })

         // Local sidebar inside the group folder
         const localSidebar = readSidebar(`${contentRoot}/${g}/_sidebar.json`)
         const listedItems = localSidebar.ordered
           .map((e) => (e.path.endsWith('/') ? e.path.slice(0, -1) : e.path))
           .filter((p) => p)
         const itemAlias = localSidebar.alias
         const itemHidden = localSidebar.hidden
         const listedItemSet = new Set(listedItems)

         // Map items by slug within the group
         const itemBySlug = new Map<string, ContentEntry>()
         for (const e of items) {
           const rel = e.url.replace(new RegExp('^' + base + '/'), '')
           const parts = rel.split('/').filter(Boolean)
           const slug = parts[1]
           itemBySlug.set(slug, e)
         }

         // Build ordered item list: listed first, then remaining alpha
         const remainingItemSlugs = Array.from(itemBySlug.keys())
           .filter((s) => !listedItemSet.has(s))
           .sort()
         const finalItemSlugs = [
           ...listedItems.filter((s) => itemBySlug.has(s)),
           ...remainingItemSlugs,
         ]

         // Group label: alias from root sidebar or folder name
         const groupLabel = rootAlias.get(groupKey) || capitalize(g)

         // Build nav items, apply alias and hidden
         const navItems = [] as { url: string; title: string }[]
         for (const slug of finalItemSlugs) {
           if (itemHidden.has(slug)) continue
           const entry = itemBySlug.get(slug)!
           const title = itemAlias.get(slug) || entry.title || capitalize(slug)
           navItems.push({ url: entry.url, title })
         }

         if (navItems.length === 0) return null
         return { label: groupLabel, items: navItems, dir: g } as any
       }

       // Helper: build a doc NavGroup (as a root nav item)
       function buildDoc(slug: string): NavGroup | null {
         if (rootHidden.has(slug)) return null
         const entry = topDocs.get(slug)
         if (!entry) return null
         const label = rootAlias.get(slug) || entry.title || capitalize(slug)
         // Represent a root doc as a group with href and no items
         return { label, href: entry.url, items: [], dir: slug } as any
       }

       // Root ordering: respect the root _sidebar.json order exactly, mixing docs and groups
       const listed = rootSidebar.ordered.map((e) => e.path).filter(Boolean)
       const listedGroups = listed.filter((p) => /\/$/.test(p)).map((p) => p.slice(0, -1))
       const listedDocs = listed.filter((p) => !/\/$/.test(p))

       const listedSet = new Set(listed)

       const nav: NavGroup[] = []
       for (const pth of listed) {
         if (/\/$/.test(pth)) {
           const g = pth.slice(0, -1)
           const grp = buildGroup(g)
           if (grp) nav.push(grp)
         } else {
           const doc = buildDoc(pth)
           if (doc) nav.push(doc)
         }
       }

       // Append remaining groups (not listed) alphabetically
       const remainingGroups = groups
         .filter((g) => !listedGroups.includes(g))
         .sort()
       for (const g of remainingGroups) {
         const grp = buildGroup(g)
         if (grp) nav.push(grp)
       }

       // Append remaining top-level docs (not listed) alphabetically
       const remainingDocs = Array.from(topDocs.keys())
         .filter((d) => !listedDocs.includes(d))
         .sort()
       for (const d of remainingDocs) {
         const doc = buildDoc(d)
         if (doc) nav.push(doc)
       }

       return { nav }
    },
  }
}

export function classifySegment(segment: string): 'root' | 'group' | 'doc' {
  const parts = (segment || '').split('/').filter(Boolean)
  if (parts.length === 0) return 'root'
  if (parts.length === 1) return 'group'
  return 'doc'
}

export function firstUrlForSection(nav: NavGroup[]): string | undefined {
  const first = nav[0]
  if (!first) return undefined
  return first.items[0]?.url ?? (first as any).href
}

export function firstUrlForGroup(nav: NavGroup[], dir: string): string | undefined {
  const group = nav.find((g) => g.dir === dir)
  if (!group) return undefined
  return group.items[0]?.url ?? (group as any).href
}

export function resolveOrNext(
  section: ReturnType<typeof createSection>,
  segment: string,
):
  | { kind: 'ok'; segment: string; nav: NavGroup[] }
  | { kind: 'redirect'; url: string; nav: NavGroup[] }
  | { kind: 'not_found'; nav: NavGroup[] } {
  const resolve = section.resolver()
  const { nav } = section.nav()

  if (resolve(segment)) {
    return { kind: 'ok', segment, nav }
  }

  const kind = classifySegment(segment)
  if (kind === 'root') {
    const url = firstUrlForSection(nav)
    if (url) return { kind: 'redirect', url, nav }
    return { kind: 'not_found', nav }
  }

  if (kind === 'group') {
    const dir = (segment || '').split('/').filter(Boolean)[0]
    const url = firstUrlForGroup(nav, dir)
    if (url) return { kind: 'redirect', url, nav }
    return { kind: 'not_found', nav }
  }

  return { kind: 'not_found', nav }
}

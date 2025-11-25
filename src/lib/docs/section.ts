import { createContentEntries } from './content'
import { makeResolver, type MdModule } from './resolver'
import type { ContentEntry, NavGroup } from './types'
import { parseSidebarConfig, type SidebarConfig } from './sidebar'

// Glob all content once; filter by section at runtime
const allMods = import.meta.glob('/docs/**/*.{md,mdx}', {
  eager: true,
}) as Record<string, MdModule>
// Glob all sidebars once; filter by section path
const allTocs = import.meta.glob('/docs/**/_toc.{ts,js}', {
  eager: true,
}) as Record<string, any>

function filterMods(section: string): Record<string, MdModule> {
  const sec = section.replace(/^\/+|\/+$/g, '')
  const prefix = `/docs/${sec}/`
  return Object.fromEntries(
    Object.entries(allMods).filter(([fs]) => fs.startsWith(prefix)),
  )
}

function readTocFor(root: string): SidebarConfig {
  for (const ext of ['.ts', '.js']) {
    const p = `${root}/_toc${ext}`
    const mod = (allTocs as Record<string, any>)[p]
    const raw = mod?.default ?? null
    if (raw !== null && raw !== undefined) {
      return parseSidebarConfig(raw)
    }
  }
  return parseSidebarConfig(null)
}

function capitalize(name: string) {
  return name.replace(/(^|\/)\w/g, (m) => m.toUpperCase())
}

export function createSection(section: string) {
  const sec = section.replace(/^\/+|\/+$/g, '')
  const base = `/${sec}`
  const contentRoot = `/docs/${sec}`
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

      // Rel parts helper relative to base
      const basePrefix = new RegExp('^' + base + '/')
      const relParts = (url: string) => {
        const rel = url.replace(basePrefix, '')
        return rel.split('/').filter(Boolean)
      }

      // Parent (root) sidebar
      const rootSidebar = readTocFor(contentRoot)
      const rootAlias = rootSidebar.alias
      const rootHidden = rootSidebar.hidden

      // Collect top-level docs (files directly under the section)
      const topDocs: Map<string, ContentEntry> = new Map()
      for (const e of entries) {
        const parts = relParts(e.url)
        if (parts.length === 1 && !e.isIndex) {
          topDocs.set(parts[0], e)
        }
      }

      function buildGroup(g: string): NavGroup | null {
        const groupKey = `${g}/`
        if (rootHidden.has(groupKey)) return null

        const items = entries.filter((e) => {
          const parts = relParts(e.url)
          return parts[0] === g && parts.length === 2
        })

        const localSidebar = readTocFor(`${contentRoot}/${g}`)
        const listedItems = localSidebar.ordered
          .map((e) => (e.path.endsWith('/') ? e.path.slice(0, -1) : e.path))
          .filter((p) => p)
        const itemAlias = localSidebar.alias
        const itemHidden = localSidebar.hidden

        const itemBySlug = new Map<string, ContentEntry>()
        for (const e of items) {
          const parts = relParts(e.url)
          const slug = parts[1]
          itemBySlug.set(slug, e)
        }

        const finalItemSlugs = listedItems.filter((s) => itemBySlug.has(s))

        const groupLabel = rootAlias.get(groupKey) || capitalize(g)

        const navItems: import('./types').NavItem[] = []
        for (const slug of finalItemSlugs) {
          if (itemHidden.has(slug)) continue
          const entry = itemBySlug.get(slug)!
          const title = itemAlias.get(slug) || entry.title || capitalize(slug)
          navItems.push({ url: entry.url, title })
        }

        if (navItems.length === 0) return null
        return { label: groupLabel, items: navItems, dir: g }
      }

      function buildDoc(slug: string): NavGroup | null {
        if (rootHidden.has(slug)) return null
        const entry = topDocs.get(slug)
        if (!entry) return null
        const label = rootAlias.get(slug) || entry.title || capitalize(slug)
        return { label, href: entry.url, items: [], dir: slug }
      }

      const listed = rootSidebar.ordered.map((e) => e.path).filter(Boolean)

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

      return { nav }
    },
  }
}

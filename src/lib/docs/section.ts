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

      // Parent (root) sidebar for group ordering and alias/hidden
      const rootSidebar = readSidebar(`${contentRoot}/_sidebar.json`)
      const listedGroups = rootSidebar.ordered
        .map((e) => e.path.endsWith('/') ? e.path.slice(0, -1) : e.path)
        .filter((g) => g)

      const groupAlias = rootSidebar.alias
      const groupHidden = rootSidebar.hidden

      // Order groups: listed first (in order), then remaining alphabetically
      const listedSet = new Set(listedGroups)
      const remainingGroups = groups.filter((g) => !listedSet.has(g)).sort()
      const orderedGroups = [...listedGroups, ...remainingGroups]

      const nav: NavGroup[] = []
      for (const g of orderedGroups) {
        // Skip hidden groups via root sidebar (key with trailing slash)
        const groupKey = `${g}/`
        if (groupHidden.has(groupKey)) continue

        // Collect direct items within this group (one level deep)
        const items = entries.filter((e) => {
          const rel = e.url.replace(new RegExp('^' + base + '/'), '')
          const parts = rel.split('/').filter(Boolean)
          return parts[0] === g && parts.length === 2 && !e.isIndex
        })

        // Local sidebar inside the group folder
        const localSidebar = readSidebar(`${contentRoot}/${g}/_sidebar.json`)
        const listedItems = localSidebar.ordered
          .map((e) => e.path.endsWith('/') ? e.path.slice(0, -1) : e.path)
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
        const finalItemSlugs = [...listedItems.filter((s) => itemBySlug.has(s)), ...remainingItemSlugs]

        // Group label: alias from root sidebar or folder name
        const groupLabel = groupAlias.get(groupKey) || capitalize(g)

        // Build nav items, apply alias and hidden
        const navItems = [] as { url: string; title: string }[]
        for (const slug of finalItemSlugs) {
          if (itemHidden.has(slug)) continue
          const entry = itemBySlug.get(slug)!
          const title = itemAlias.get(slug) || entry.title || capitalize(slug)
          navItems.push({ url: entry.url, title })
        }

        // Skip empty groups with no items
        if (navItems.length === 0) continue

        nav.push({ label: groupLabel, items: navItems, dir: g } as any)
      }

      return { nav }
    },
  }
}

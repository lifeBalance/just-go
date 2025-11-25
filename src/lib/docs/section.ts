// Path utilities colocated for simplicity
export function normalizePath(path: string): string {
  return path.replace(/\/$/, '')
}

// Convert a source file path under `/docs` to a public route
// - /docs/basics/introduction/index.mdx -> /basics/introduction/
// - /docs/basics/variables/intro.md     -> /basics/variables/intro
export function fsPathToRoute(fsPath: string): string {
  return fsPath
    .replace(/^\/docs/, '')
    .replace(/index\.(md|mdx)$/, '')
    .replace(/\.(md|mdx)$/, '')
}
type MdModule = { default: unknown }
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
  return name.replace(/(^|\/ )\w/g, (m) => m.toUpperCase())
}

export type SectionPageParam = { section: string; page?: string }

export function listSectionPageParams(): SectionPageParam[] {
  const mods = import.meta.glob('/docs/**/*.{md,mdx}', { eager: true })
  const sections = new Set<string>()
  const out: SectionPageParam[] = []
  for (const fs of Object.keys(mods)) {
    const route = fsPathToRoute(fs)
    const parts = route.split('/').filter(Boolean)
    const section = parts[0] || ''
    const page = parts.slice(1).join('/')
    if (section) sections.add(section)
    if (page) out.push({ section, page })
  }
  for (const section of sections) {
    out.push({ section })
  }
  return out
}

export function getDocStaticPaths() {
  return listSectionPageParams().map(({ section, page }) => ({ params: { section, page } }))
}

// Navigation helpers & routing logic (colocated for simplicity)
export type FlatNavItem = { url: string; title: string }

function flattenNav(nav: NavGroup[]): FlatNavItem[] {
  const items: FlatNavItem[] = []
  for (const g of nav) {
    if (g.href && g.items.length === 0) {
      items.push({ url: g.href, title: g.label })
    } else {
      for (const it of g.items) items.push({ url: it.url, title: it.title })
    }
  }
  return items
}

export function getPrevNext(nav: NavGroup[], currentPath: string): { prev?: FlatNavItem; next?: FlatNavItem } {
  const flat = flattenNav(nav)
  const idx = flat.findIndex((i) => normalizePath(i.url) === normalizePath(currentPath))
  if (idx === -1) return {}
  return {
    prev: idx > 0 ? flat[idx - 1] : undefined,
    next: idx < flat.length - 1 ? flat[idx + 1] : undefined,
  }
}

function classifySegment(segment: string): 'root' | 'group' | 'doc' {
  const parts = (segment || '').split('/').filter(Boolean)
  if (parts.length === 0) return 'root'
  if (parts.length === 1) return 'group'
  return 'doc'
}

function firstUrlForSection(nav: NavGroup[]): string | undefined {
  const first = nav[0]
  if (!first) return undefined
  return first.items[0]?.url ?? first.href
}

function firstUrlForGroup(nav: NavGroup[], dir: string): string | undefined {
  const group = nav.find((g) => g.dir === dir)
  if (!group) return undefined
  return group.items[0]?.url ?? group.href
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


export function createSection(section: string) {
  const sec = section.replace(/^\/+|\/+$/g, '')
  const base = `/${sec}`
  const contentRoot = `/docs/${sec}`
  const mods = filterMods(section)
  return {
    base,
    entries(): ContentEntry[] {
      const baseNoSlash = base.replace(/^\//, '')
      return Object.entries(mods).map(([fs, mod]) => {
        const isIndex = /\/index\.(md|mdx)$/.test(fs)
        const url = fsPathToRoute(fs)
        const rel = url.replace(new RegExp('^/' + baseNoSlash + '/'), '')
        const dir = rel.split('/').slice(0, -1).join('/') || ''
        const fallbackTitle = isIndex ? (dir || baseNoSlash) : rel.split('/').pop() || ''
        const title = (mod as any)?.metadata?.title ?? fallbackTitle
        return { url, title, isIndex }
      })
    },
    resolver() {
      const entries = Object.entries(mods)
      const routeMap = new Map<string, MdModule>(
        entries.map(([fs, mod]) => [normalizePath(fsPathToRoute(fs)), mod as MdModule]),
      )
      const baseNorm = normalizePath(base)
      return (seg: string) => {
        const target = normalizePath(baseNorm + (seg ? '/' + seg : ''))
        return routeMap.get(target)
      }
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

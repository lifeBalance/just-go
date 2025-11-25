import { parseSidebarConfig, type SidebarConfig } from './sidebar'

// Single source of truth for path operations
const Path = {
  normalize: (p: string) => p.replace(/\/$/, ''),
  trimSlashes: (p: string) => p.replace(/^\/+|\/+$/g, ''),
  isGroup: (p: string) => /\/$/.test(p),
  fsToRoute: (fs: string) =>
    fs
      .replace(/^\/docs/, '')
      .replace(/index\.(md|mdx)$/, '')
      .replace(/\.(md|mdx)$/, ''),
  toRelative: (url: string, base: string) => {
    const esc = base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    return url.replace(new RegExp('^' + esc + '/'), '')
  },
}
type MdModule = { default: unknown }
export type NavItem = { url: string; title: string }

export type ResolveResult =
  | { kind: 'ok'; segment: string; nav: NavGroup[] }
  | { kind: 'redirect'; url: string; nav: NavGroup[] }
  | { kind: 'not_found'; nav: NavGroup[] }
export type NavGroup = {
  dir: string
  label: string
  href?: string
  items: NavItem[]
}
export type ContentEntry = {
  url: string
  title: string
  isIndex: boolean
}


class ContentStore {
  private mods = import.meta.glob('/docs/**/*.{md,mdx}', { eager: true }) as Record<string, MdModule>
  private tocs = import.meta.glob('/docs/**/_toc.{ts,js}', { eager: true }) as Record<string, any>

  getAllModPaths(): string[] {
    return Object.keys(this.mods)
  }

  getModsForSection(section: string) {
    const prefix = `/docs/${Path.trimSlashes(section)}/`
    return Object.fromEntries(Object.entries(this.mods).filter(([path]) => path.startsWith(prefix)))
  }

  getTocForPath(root: string): SidebarConfig {
    const tocPath = ['.ts', '.js']
      .map((ext) => `${root}/_toc${ext}`)
      .find((p) => this.tocs[p])
    const raw = tocPath ? this.tocs[tocPath]?.default ?? null : null
    return parseSidebarConfig(raw)
  }
}

const store = new ContentStore()

function capitalize(name: string) {
  return name.replace(/(^|\/ )\w/g, (m) => m.toUpperCase())
}

export type SectionPageParam = { section: string; page?: string }

export function listSectionPageParams(): SectionPageParam[] {
  const fsList = store.getAllModPaths()
  const sections = new Set<string>()
  const out: SectionPageParam[] = []
  for (const fs of fsList) {
    const route = Path.fsToRoute(fs)
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
  return listSectionPageParams().map(({ section, page }) => ({
    params: { section, page },
  }))
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

export function getPrevNext(
  nav: NavGroup[],
  currentPath: string
): { prev?: FlatNavItem; next?: FlatNavItem } {
  const flat = flattenNav(nav)
  const idx = flat.findIndex(
    (i) => Path.normalize(i.url) === Path.normalize(currentPath)
  )
  if (idx === -1) return {}
  return {
    prev: idx > 0 ? flat[idx - 1] : undefined,
    next: idx < flat.length - 1 ? flat[idx + 1] : undefined,
  }
}


export function resolveOrNext(
  section: ReturnType<typeof createSection>,
  segment: string,
): ResolveResult {
  const resolve = section.resolver()
  const { nav } = section.nav()

  if (resolve(segment)) {
    return { kind: 'ok', segment, nav }
  }

  const parts = (segment || '').split('/').filter(Boolean)
  const fallbackUrl = parts.length === 0
    ? (nav[0]?.items[0]?.url ?? nav[0]?.href)
    : (() => {
        const grp = nav.find((g) => g.dir === parts[0])
        return grp?.items[0]?.url ?? grp?.href
      })()

  return fallbackUrl
    ? { kind: 'redirect', url: fallbackUrl, nav }
    : { kind: 'not_found', nav }
}

export function createSection(section: string) {
  const sec = Path.trimSlashes(section)
  const base = `/${sec}`
  const contentRoot = `/docs/${sec}`
  const mods = store.getModsForSection(section)
  return {
    base,
    entries(): ContentEntry[] {
      const baseNoSlash = base.replace(/^\//, '')
      const baseRelPrefix = new RegExp('^/' + baseNoSlash + '/')
      return Object.entries(mods).map(([fs, mod]) => {
        const isIndex = /\/index\.(md|mdx)$/.test(fs)
        const url = Path.fsToRoute(fs)
        const rel = Path.toRelative(url, base)
        const dir = rel.split('/').slice(0, -1).join('/') || ''
        const fallbackTitle = isIndex ? dir || sec : rel.split('/').pop() || ''
        const title = (mod as any)?.metadata?.title ?? fallbackTitle
        return { url, title, isIndex }
      })
    },
    resolver() {
      const entries = Object.entries(mods)
      const routeMap = new Map<string, MdModule>(
        entries.map(([fs, mod]) => [
          Path.normalize(Path.fsToRoute(fs)),
          mod as MdModule,
        ])
      )
      const baseNorm = Path.normalize(base)
      return (seg: string) => {
        const target = Path.normalize(baseNorm + (seg ? '/' + seg : ''))
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
      const rootSidebar = store.getTocForPath(contentRoot)
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

      // Precompute group index for efficient lookups
      const groupIndex = new Map<string, Map<string, ContentEntry>>()
      for (const e of entries) {
        const parts = relParts(e.url)
        if (parts.length === 2) {
          const g = parts[0]
          const slug = parts[1]
          if (!groupIndex.has(g)) groupIndex.set(g, new Map())
          groupIndex.get(g)!.set(slug, e)
        }
      }

      // Unified builder for both groups and single docs
      function buildNavItem(path: string): NavGroup | null {
        const isGroup = Path.isGroup(path)
        const key = path
        if (isGroup) {
          // Group visibility and label come from root sidebar
          if (rootHidden.has(key)) return null
          const dir = path.slice(0, -1)
          const itemBySlug = groupIndex.get(dir) ?? new Map<string, ContentEntry>()
          const localSidebar = store.getTocForPath(`${contentRoot}/${dir}`)
          const listedItems = localSidebar.ordered
            .map((e) => (Path.isGroup(e.path) ? e.path.slice(0, -1) : e.path))
            .filter((p) => p)
          const itemAlias = localSidebar.alias
          const itemHidden = localSidebar.hidden
          const finalItemSlugs = listedItems.filter((s) => itemBySlug.has(s))
          const groupLabel = rootAlias.get(key) || capitalize(dir)
          const navItems: NavItem[] = []
          for (const slug of finalItemSlugs) {
            if (itemHidden.has(slug)) continue
            const entry = itemBySlug.get(slug)!
            const title = itemAlias.get(slug) || entry.title || capitalize(slug)
            navItems.push({ url: entry.url, title })
          }
          if (navItems.length === 0) return null
          return { label: groupLabel, items: navItems, dir }
        }
        // Single doc at section root
        if (rootHidden.has(key)) return null
        const entry = topDocs.get(key)
        if (!entry) return null
        const label = rootAlias.get(key) || entry.title || capitalize(key)
        return { label, href: entry.url, items: [], dir: key }
      }

      const listed = rootSidebar.ordered.map((e) => e.path).filter(Boolean)

      const nav: NavGroup[] = []
      for (const pth of listed) {
        const node = buildNavItem(pth)
        if (node) nav.push(node)
      }

      return { nav }
    },
  }
}

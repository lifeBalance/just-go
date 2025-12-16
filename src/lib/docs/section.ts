import { parseTocConfig, type TocConfig } from './tocParser'
import { docsConfig, getGlobRegistry } from './config'

// Single source of truth for path operations
// Path utilities for routes and FS paths
const Path = {
  normalize: (p: string) => p.replace(/\/$/, ''),
  trimSlashes: (p: string) => p.replace(/^\/+|\/+$/g, ''),
  isGroup: (p: string) => /\/$/.test(p),
  fsToRoute: (fs: string) => {
    const br = docsConfig.branches.find((b) => fs.startsWith(`${b.root.replace(/\/$/, '')}/`))
    if (!br) return ''
    const rel = fs
      .slice(br.root.length)
      .replace(/^\/+/, '')
      .replace(/index\.(md|mdx)$/, '')
      .replace(/\.(md|mdx)$/, '')
    return `/${br.id}/${rel}`
  },
  toRelative: (url: string, base: string) => {
    const esc = base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    return url.replace(new RegExp('^' + esc + '/'), '')
  },
  getParts: (url: string, base: string) =>
    Path.toRelative(url, base).split('/').filter(Boolean),
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

const GLOB_REGISTRY = getGlobRegistry() as Record<string, Record<string, any>>

const STATIC_MODS = Object.assign(
  {},
  ...docsConfig.branches.map((b) => (GLOB_REGISTRY[b.id]?.content ?? {}))
) as Record<string, MdModule>

const STATIC_TOCS = Object.assign(
  {},
  ...docsConfig.branches.map((b) => (GLOB_REGISTRY[b.id]?.toc ?? {}))
) as Record<string, any>

// ContentStore: caches docs and _toc modules; provides lookups
class ContentStore {
  constructor(
    private mods: Record<string, MdModule>,
    private tocs: Record<string, any>
  ) {}

  getAllModPaths(): string[] {
    return Object.keys(this.mods)
  }

  getModsForSection(section: string) {
    const branch = docsConfig.branches.find((b) => b.id === Path.trimSlashes(section))
    if (!branch) return {}
    const prefix = `${branch.root.replace(/\/$/, '')}/`
    return Object.fromEntries(
      Object.entries(this.mods).filter(([path]) => path.startsWith(prefix))
    )
  }

  getTocForPath(root?: string): TocConfig {
    if (!root) return parseTocConfig(null)
    const tocPath = ['.ts', '.js']
      .map((ext) => `${root}/_toc${ext}`)
      .find((p) => this.tocs[p])
    return parseTocConfig(tocPath ? this.tocs[tocPath]?.default : null)
  }
}

const store = new ContentStore(STATIC_MODS, STATIC_TOCS)

function capitalize(name: string) {
  return name.replace(/(^|\/ )\w/g, (m) => m.toUpperCase())
}

export type SectionPageParam = { section: string; page?: string }

// Enumerate {section, page} pairs from /docs for static paths


export function listSectionPageParams(): SectionPageParam[] {
  const fsList = store.getAllModPaths()
  const sections = new Set<string>()
  const out: SectionPageParam[] = []

  for (const fs of fsList) {
    const route = Path.fsToRoute(fs)
    if (!route) continue
    const parts = route.split('/').filter(Boolean)
    const section = parts[0] || ''
    const page = parts.slice(1).join('/')

    // Filter by configured branches
    if (section && !docsConfig.branches.some((b) => b.id === section)) {
      continue
    }

    if (section) sections.add(section)
    if (page) out.push({ section, page })
  }

  for (const section of sections) {
    out.push({ section })
  }

  if (import.meta.env.DEV) {
    const sample = out.slice(0, 20)
    console.log('[docs] discovered routes:', sample)
    console.log('[docs] sections:', Array.from(sections))
  }

  return out
}

export function getDocStaticPaths() {
  return listSectionPageParams().map(({ section, page }) => ({
    params: { section, page },
  }))
}

type FlatNavItem = { url: string; title: string }

function flattenNav(nav: NavGroup[]): FlatNavItem[] {
  return nav.flatMap((g) =>
    g.href && !g.items.length ? [{ url: g.href, title: g.label }] : g.items
  )
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
  segment: string
): ResolveResult {
  const resolve = section.resolver()
  const { nav } = section.nav()

  if (resolve(segment)) {
    return { kind: 'ok', segment, nav }
  }

  const parts = (segment || '').split('/').filter(Boolean)
  const fallbackUrl =
    parts.length === 0
      ? (nav[0]?.items[0]?.url ?? nav[0]?.href)
      : (() => {
          const grp = nav.find((g) => g.dir === parts[0])
          return grp?.items[0]?.url ?? grp?.href
        })()

  return fallbackUrl
    ? { kind: 'redirect', url: fallbackUrl, nav }
    : { kind: 'not_found', nav }
}

// Helper to categorize entries by depth for efficient lookups
function categorizeEntries(entries: ContentEntry[], base: string) {
  const topDocs = new Map<string, ContentEntry>()
  const groupIndex = new Map<string, Map<string, ContentEntry>>()

  for (const entry of entries) {
    const parts = Path.getParts(entry.url, base)

    if (parts.length === 1 && !entry.isIndex) {
      topDocs.set(parts[0], entry)
    } else if (parts.length === 2) {
      const [group, slug] = parts
      if (!groupIndex.has(group)) groupIndex.set(group, new Map())
      groupIndex.get(group)!.set(slug, entry)
    }
  }

  return { topDocs, groupIndex }
}

export function createSection(
  section: string,
  basePath?: string,
  contentRootArg?: string
) {
  const sec = Path.trimSlashes(section)
  const basePrefix = (basePath ?? docsConfig.basePath ?? import.meta.env.BASE_URL).replace(/\/$/, '')
  const branch = docsConfig.branches.find((b) => b.id === sec)
  const contentRoot = contentRootArg ?? branch?.root
  const base = `${basePrefix}/${sec}`
  const mods = store.getModsForSection(section)

  return {
    base,

    entries(): ContentEntry[] {
      return Object.entries(mods).map(([fs, mod]) => {
        const isIndex = /\/index\.(md|mdx)$/.test(fs)
        const url = `${basePrefix}${Path.fsToRoute(fs)}`
        const rel = Path.toRelative(url, base)
        const dir = rel.split('/').slice(0, -1).join('/') || ''
        const fallbackTitle = isIndex ? dir || sec : rel.split('/').pop() || ''
        const title = (mod as any)?.metadata?.title ?? fallbackTitle
        return { url, title, isIndex }
      })
    },

    resolver() {
      const routeMap = new Map(
        Object.entries(mods).map(([fs, mod]) => [
          Path.normalize(`${basePrefix}${Path.fsToRoute(fs)}`),
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
      const rootSidebar = store.getTocForPath(contentRoot)
      const { topDocs, groupIndex } = categorizeEntries(entries, base)

      function buildGroup(dir: string): NavGroup | null {
        const groupKey = `${dir}/`


        const itemBySlug = groupIndex.get(dir) ?? new Map()
        const localSidebar = store.getTocForPath(`${contentRoot}/${dir}`)

        const navItems: NavItem[] = localSidebar.ordered
          .map((e) => (Path.isGroup(e.path) ? e.path.slice(0, -1) : e.path))
          .filter(
            (slug) =>
              slug && itemBySlug.has(slug)
          )
          .map((slug) => {
            const entry = itemBySlug.get(slug)!
            return {
              url: entry.url,
              title:
                localSidebar.alias.get(slug) || entry.title || capitalize(slug),
            }
          })

        if (!navItems.length) return null

        return {
          label: rootSidebar.alias.get(groupKey) || capitalize(dir),
          items: navItems,
          dir,
        }
      }

      function buildDoc(slug: string): NavGroup | null {


        const entry = topDocs.get(slug)
        if (!entry) return null

        return {
          label: rootSidebar.alias.get(slug) || entry.title || capitalize(slug),
          href: entry.url,
          items: [],
          dir: slug,
        }
      }

      return {
        nav: rootSidebar.ordered
          .map((e) => e.path)
          .filter(Boolean)
          .map((path) =>
            Path.isGroup(path) ? buildGroup(path.slice(0, -1)) : buildDoc(path)
          )
          .filter((node): node is NavGroup => node !== null),
      }
    },
  }
}

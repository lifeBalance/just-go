import { parseTocConfig } from './tocParser.js'
import { docsConfig, getGlobRegistry } from './config.js'

const Path = {
  normalize: (p) => p.replace(/\/$/, ''),
  trimSlashes: (p) => p.replace(/^\/+|\/+$/g, ''),
  isGroup: (p) => /\/$/.test(p),
  fsToRoute: (fs) => {
    const branch = docsConfig.branches.find((b) => fs.startsWith(`${b.root.replace(/\/$/, '')}/`))
    if (!branch) return ''
    const rel = fs
      .slice(branch.root.length)
      .replace(/^\/+/, '')
      .replace(/index\.(md|mdx)$/, '')
      .replace(/\.(md|mdx)$/, '')
    return `/${branch.id}/${rel}`
  },
  toRelative: (url, base) => {
    const esc = base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    return url.replace(new RegExp('^' + esc + '/'), '')
  },
  getParts: (url, base) => Path.toRelative(url, base).split('/').filter(Boolean),
}

const GLOB_REGISTRY = getGlobRegistry()

const STATIC_MODS = Object.assign(
  {},
  ...docsConfig.branches.map((b) => (GLOB_REGISTRY[b.id]?.content ?? {}))
)

const STATIC_TOCS = Object.assign(
  {},
  ...docsConfig.branches.map((b) => (GLOB_REGISTRY[b.id]?.toc ?? {}))
)

class ContentStore {
  constructor(mods, tocs) {
    this.mods = mods
    this.tocs = tocs
  }

  getAllModPaths() {
    return Object.keys(this.mods)
  }

  getModsForSection(section) {
    const branch = docsConfig.branches.find((b) => b.id === Path.trimSlashes(section))
    if (!branch) return {}
    const prefix = `${branch.root.replace(/\/$/, '')}/`
    return Object.fromEntries(
      Object.entries(this.mods).filter(([path]) => path.startsWith(prefix))
    )
  }

  getTocForPath(root) {
    if (!root) return parseTocConfig(null)
    const tocPath = ['.ts', '.js']
      .map((ext) => `${root}/_toc${ext}`)
      .find((p) => this.tocs[p])
    return parseTocConfig(tocPath ? this.tocs[tocPath]?.default : null)
  }
}

const store = new ContentStore(STATIC_MODS, STATIC_TOCS)

function capitalize(name) {
  return name.replace(/(^|\/ )\w/g, (m) => m.toUpperCase())
}

export function listSectionPageParams() {
  const fsList = store.getAllModPaths()
  const sections = new Set()
  const out = []

  for (const fs of fsList) {
    const route = Path.fsToRoute(fs)
    if (!route) continue
    const parts = route.split('/').filter(Boolean)
    const section = parts[0] || ''
    const page = parts.slice(1).join('/')

    if (section && !docsConfig.branches.some((b) => b.id === section)) {
      continue
    }

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

function flattenNav(nav) {
  return nav.flatMap((g) => (g.href && !g.items.length ? [{ url: g.href, title: g.label }] : g.items))
}

export function getPrevNext(nav, currentPath) {
  const flat = flattenNav(nav)
  const idx = flat.findIndex((i) => Path.normalize(i.url) === Path.normalize(currentPath))

  if (idx === -1) return {}

  return {
    prev: idx > 0 ? flat[idx - 1] : undefined,
    next: idx < flat.length - 1 ? flat[idx + 1] : undefined,
  }
}

export function resolveOrNext(section, segment) {
  const resolve = section.resolver()
  const { nav } = section.nav()

  if (resolve(segment)) {
    return { kind: 'ok', segment, nav }
  }

  const parts = (segment || '').split('/').filter(Boolean)
  const fallbackUrl =
    parts.length === 0
      ? nav[0]?.items[0]?.url ?? nav[0]?.href
      : (() => {
          const grp = nav.find((g) => g.dir === parts[0])
          return grp?.items[0]?.url ?? grp?.href
        })()

  return fallbackUrl
    ? { kind: 'redirect', url: fallbackUrl, nav }
    : { kind: 'not_found', nav }
}

function categorizeEntries(entries, base) {
  const topDocs = new Map()
  const groupIndex = new Map()

  for (const entry of entries) {
    const parts = Path.getParts(entry.url, base)

    if (parts.length === 1 && !entry.isIndex) {
      topDocs.set(parts[0], entry)
    } else if (parts.length === 2) {
      const [group, slug] = parts
      if (!groupIndex.has(group)) groupIndex.set(group, new Map())
      groupIndex.get(group).set(slug, entry)
    }
  }

  return { topDocs, groupIndex }
}

export function createSection(section, basePath, contentRootArg) {
  const sec = Path.trimSlashes(section)
  const basePrefix = (basePath ?? docsConfig.basePath).replace(/\/$/, '')
  const branch = docsConfig.branches.find((b) => b.id === sec)
  const contentRoot = contentRootArg ?? branch?.root
  if (!contentRoot) {
    throw new Error(`Docs section "${section}" is not configured. Did you register it in docsIntegration({ sections: [...] })?`)
  }

  const base = `${basePrefix}/${sec}`
  const mods = store.getModsForSection(section)

  return {
    base,
    entries() {
      return Object.entries(mods).map(([fs, mod]) => {
        const isIndex = /\/index\.(md|mdx)$/.test(fs)
        const url = `${basePrefix}${Path.fsToRoute(fs)}`
        const rel = Path.toRelative(url, base)
        const dir = rel.split('/').slice(0, -1).join('/') || ''
        const fallbackTitle = isIndex ? dir || sec : rel.split('/').pop() || ''
        const title = mod?.metadata?.title ?? fallbackTitle
        return { url, title, isIndex }
      })
    },
    resolver() {
      const routeMap = new Map(
        Object.entries(mods).map(([fs, mod]) => [
          Path.normalize(`${basePrefix}${Path.fsToRoute(fs)}`),
          mod,
        ])
      )
      const baseNorm = Path.normalize(base)

      return (seg) => {
        const target = Path.normalize(baseNorm + (seg ? '/' + seg : ''))
        return routeMap.get(target)
      }
    },
    nav() {
      const entries = this.entries()
      const rootSidebar = store.getTocForPath(contentRoot)
      const { topDocs, groupIndex } = categorizeEntries(entries, base)

      function buildGroup(dir) {
        const groupKey = `${dir}/`

        const itemBySlug = groupIndex.get(dir) ?? new Map()
        const localSidebar = store.getTocForPath(`${contentRoot}/${dir}`)

        const navItems = localSidebar.ordered
          .map((e) => (Path.isGroup(e.path) ? e.path.slice(0, -1) : e.path))
          .filter((slug) => slug && itemBySlug.has(slug))
          .map((slug) => {
            const entry = itemBySlug.get(slug)
            return {
              url: entry.url,
              title: localSidebar.alias.get(slug) || entry.title || capitalize(slug),
            }
          })

        if (!navItems.length) return null

        return {
          label: rootSidebar.alias.get(groupKey) || capitalize(dir),
          items: navItems,
          dir,
        }
      }

      function buildDoc(slug) {
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
          .map((path) => (Path.isGroup(path) ? buildGroup(path.slice(0, -1)) : buildDoc(path)))
          .filter((node) => node !== null),
      }
    },
  }
}

import { normalizePath, relSlug as relSlugBase } from './paths'

export type NavItem = { url: string; title: string; weight: number }
export type NavGroup = {
  dir: string
  label: string
  href?: string
  items: NavItem[]
}
export type ContentEntry = {
  url: string
  dir: string
  title: string
  isIndex: boolean
  mod?: any
}

export function createNav(
  entries: ContentEntry[],
  base: string,
  orderIndex?: Map<string, number>,
): { nav: NavGroup[] } {
  const baseNorm = normalizePath(base)
  const relSlug = (url: string) => relSlugBase(url, baseNorm)
  const order = orderIndex ?? new Map<string, number>()

  // Collect folder titles and hrefs from index pages
  const folderTitle = new Map<string, string>()
  const folderHref = new Map<string, string>()
  for (const e of entries) {
    if (e.isIndex) {
      const metaTitle: string | undefined = (e.mod as any)?.metadata?.title
      const pretty = e.dir
        ? metaTitle || e.dir.replace(/(^|\/)[a-z]/g, (m) => m.toUpperCase())
        : metaTitle || baseNorm.replace(/^\//, '')
      folderTitle.set(e.dir, pretty)
      folderHref.set(e.dir, normalizePath(e.url))
    }
  }

  type Group = NavGroup & { weight: number }
  const groups = new Map<string, Group>()
  for (const e of entries) {
    if (e.isIndex) continue
    const dir = e.dir || ''
    const label = folderTitle.get(dir) || (dir ? dir : baseNorm.replace(/^\//, ''))
    const href = folderHref.get(dir)
    const w = order.get(relSlug(e.url)) ?? Number.POSITIVE_INFINITY
    const gw = order.get(normalizePath(dir)) ?? Number.POSITIVE_INFINITY
    let g = groups.get(dir)
    if (!g) {
      g = { dir, label, href, items: [], weight: gw }
      groups.set(dir, g)
    }
    if (!g.items.some((it) => it.url === e.url)) {
      g.items.push({ url: e.url, title: e.title, weight: w })
    }
  }

  const nav: NavGroup[] = Array.from(groups.values())
    .map((g) => ({
      dir: g.dir,
      label: g.label,
      href: g.href,
      items: g.items
        .filter((it) => it.url)
        .sort((a, b) => a.weight - b.weight || a.title.localeCompare(b.title)),
    }))
    .sort((a, b) => {
      const aw = order.get(normalizePath(a.dir)) ?? Number.POSITIVE_INFINITY
      const bw = order.get(normalizePath(b.dir)) ?? Number.POSITIVE_INFINITY
      if (aw !== bw) return aw - bw
      return (a.label || '').localeCompare(b.label || '')
    })

  return { nav }
}

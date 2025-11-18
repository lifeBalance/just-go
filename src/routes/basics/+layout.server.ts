import { fsPathToRoute, relSlug as relSlugBase } from '$lib/docs/paths'

export const load = async () => {
  const mods = import.meta.glob('/src/content/basics/**/*.md', {
    eager: true,
  }) as Record<string, any>
  const toUrl = (fs: string) => fsPathToRoute(fs)
  const entries = Object.entries(mods).map(([fs, mod]) => {
    const isIndex = /\/index\.md$/.test(fs)
    const url = toUrl(fs)
    const rel = url.replace(/^\/basics\//, '')
    const dir = rel.split('/').slice(0, -1).join('/') || ''
    const title = mod?.metadata?.title ?? (isIndex ? (dir || 'Basics') : (rel.split('/').pop() || ''))
    return { url, dir, title, isIndex, fs, mod }
  })

  // Optional order config
  const orderMod = import.meta.glob('/src/content/basics/_sidebar.json', {
    eager: true,
  }) as Record<string, any>
  const orderList: string[] =
    orderMod['/src/content/basics/_sidebar.json']?.default ?? []
  const orderIndex = new Map(
    orderList.map((slug, i) => [slug.replace(/\/$/, ''), i]),
  )

  // Build folder titles and hrefs from index.md frontmatter when available
  const folderTitle = new Map<string, string>()
  const folderHref = new Map<string, string>()
  for (const e of entries) {
    if (e.isIndex) {
      const metaTitle: string | undefined = (e.mod as any)?.metadata?.title
      const pretty = e.dir
        ? metaTitle || e.dir.replace(/(^|\/)\w/g, (m) => m.toUpperCase())
        : metaTitle || 'Basics'
      folderTitle.set(e.dir, pretty)
      folderHref.set(e.dir, e.url.replace(/\/$/, ''))
    }
  }

  type Group = {
    dir: string
    label: string
    href?: string
    items: { url: string; title: string; weight: number }[]
    weight: number
  }
  const groups: Record<string, Group> = {}
  const base = '/basics'
  const relSlug = (url: string) => relSlugBase(url, base)
  for (const e of entries) {
    if (e.isIndex) continue
    const dir = e.dir || ''
    const label = folderTitle.get(dir) || (dir ? dir : 'Basics')
    const href = folderHref.get(dir)
    const w = orderIndex.get(relSlug(e.url)) ?? Number.POSITIVE_INFINITY
    const gw = orderIndex.get(dir.replace(/\/$/, '')) ?? Number.POSITIVE_INFINITY
    groups[dir] ||= { dir, label, href, items: [], weight: gw }
    if (!groups[dir].items.some((it) => it.url === e.url)) {
      groups[dir].items.push({ url: e.url, title: e.title, weight: w })
    }
  }
  // sort groups and items
  const nav = Object.values(groups)
    .map((g) => ({
      label: g.label,
      href: g.href,
      items: g.items
        .filter((it) => it.url)
        .sort((a, b) => a.weight - b.weight || a.title.localeCompare(b.title)),
      dir: g.dir,
    }))
    .sort((a, b) => {
      const aw = orderIndex.get(a.dir) ?? Number.POSITIVE_INFINITY
      const bw = orderIndex.get(b.dir) ?? Number.POSITIVE_INFINITY
      if (aw !== bw) return aw - bw
      return (a.label || '').localeCompare(b.label || '')
    })
  return { nav }
}

export const load = async () => {
  const mods = import.meta.glob('/src/content/design-patterns/**/*.svx', { eager: true }) as Record<string, any>
  const toUrl = (fs: string) => fs.replace(/^\/src\/content/, '').replace(/index\.svx$/, '').replace(/\.svx$/, '')
  const entries = Object.entries(mods).map(([fs, mod]) => {
    const url = toUrl(fs)
    const rel = url.replace(/^\/design-patterns\//, '')
    const dir = rel.split('/').slice(0, -1).join('/') || ''
    const title = mod?.metadata?.title ?? (rel || 'Design Patterns')
    return { url, dir, title }
  })

  const orderMod = import.meta.glob('/src/content/design-patterns/_sidebar.json', { eager: true }) as Record<string, any>
  const orderList: string[] = orderMod['/src/content/design-patterns/_sidebar.json']?.default ?? []
  const orderIndex = new Map(orderList.map((slug, i) => [slug.replace(/\/$/, ''), i]))
  const relSlug = (url: string) => url.replace(/^\/design-patterns\//, '').replace(/\/$/, '')

  const groups: Record<string, { label: string; items: { url: string; title: string; weight: number }[]; weight: number }> = {}
  for (const e of entries) {
    const label = e.dir || 'Patterns'
    const w = orderIndex.get(relSlug(e.url)) ?? Number.POSITIVE_INFINITY
    const gw = orderIndex.get((e.dir || '').replace(/\/$/, '')) ?? Number.POSITIVE_INFINITY
    groups[label] ||= { label, items: [], weight: gw }
    groups[label].items.push({ url: e.url, title: e.title, weight: w })
  }

  const nav = Object.values(groups)
    .map((g) => ({ label: g.label, items: g.items.sort((a, b) => (a.weight - b.weight) || a.title.localeCompare(b.title)) }))
    .sort((a, b) => a.label.localeCompare(b.label))
  return { nav }
}

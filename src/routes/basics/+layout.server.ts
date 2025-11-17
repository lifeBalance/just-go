export const load = async () => {
  const mods = import.meta.glob('/src/content/basics/**/*.svx', { eager: true }) as Record<string, any>
  const toUrl = (fs: string) => fs.replace(/^\/src\/content/, '').replace(/index\.svx$/, '').replace(/\.svx$/, '')
  const entries = Object.entries(mods).map(([fs, mod]) => {
    const url = toUrl(fs)
    const rel = url.replace(/^\/basics\//, '')
    const dir = rel.split('/').slice(0, -1).join('/') || ''
    const title = mod?.metadata?.title ?? (rel || 'Basics')
    return { url, dir, title }
  })

  // Optional order config
  const orderMod = import.meta.glob('/src/content/basics/_sidebar.json', { eager: true }) as Record<string, any>
  const orderList: string[] = orderMod['/src/content/basics/_sidebar.json']?.default ?? []
  const orderIndex = new Map(orderList.map((slug, i) => [slug.replace(/\/$/, ''), i]))

  const groups: Record<string, { label: string; items: { url: string; title: string; weight: number }[]; weight: number }> = {}
  function relSlug(url: string) {
    return url.replace(/^\/basics\//, '').replace(/\/$/, '')
  }
  for (const e of entries) {
    const label = e.dir || 'Introduction'
    const w = orderIndex.get(relSlug(e.url)) ?? Number.POSITIVE_INFINITY
    const gw = orderIndex.get((e.dir || '').replace(/\/$/, '')) ?? Number.POSITIVE_INFINITY
    groups[label] ||= { label, items: [], weight: gw }
    groups[label].items.push({ url: e.url, title: e.title, weight: w })
  }
  // sort groups and items
  const nav = Object.values(groups)
    .map((g) => ({ label: g.label, items: g.items.sort((a, b) => (a.weight - b.weight) || a.title.localeCompare(b.title)) }))
    .sort((a, b) => {
      const aw = orderIndex.get(a.label) ?? Number.POSITIVE_INFINITY
      const bw = orderIndex.get(b.label) ?? Number.POSITIVE_INFINITY
      if (aw !== bw) return aw - bw
      return a.label.localeCompare(b.label)
    })
  return { nav }
}

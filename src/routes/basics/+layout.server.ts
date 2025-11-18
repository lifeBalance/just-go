import { fsPathToRoute } from '$lib/docs/paths'
import { createOrderIndex } from '$lib/docs/order'
import { createNav, type ContentEntry } from '$lib/docs/nav'

export const load = async () => {
  const mods = import.meta.glob('/src/content/basics/**/*.md', {
    eager: true,
  }) as Record<string, any>
  const toUrl = (fs: string) => fsPathToRoute(fs)
  const entries: ContentEntry[] = Object.entries(mods).map(([fs, mod]) => {
    const isIndex = /\/index\.md$/.test(fs)
    const url = toUrl(fs)
    const rel = url.replace(/^\/basics\//, '')
    const dir = rel.split('/').slice(0, -1).join('/') || ''
    const title = mod?.metadata?.title ?? (isIndex ? (dir || 'Basics') : (rel.split('/').pop() || ''))
    return { url, dir, title, isIndex, mod }
  })


  // Optional order config
  const orderMod = import.meta.glob('/src/content/basics/_sidebar.json', {
    eager: true,
  }) as Record<string, any>
  const orderIndex = createOrderIndex(
    orderMod,
    '/src/content/basics/_sidebar.json',
  )

  const { nav } = createNav(entries, '/basics', orderIndex)
  return { nav }
}

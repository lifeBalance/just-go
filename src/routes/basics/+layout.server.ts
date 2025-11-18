import { createOrderIndex } from '$lib/docs/order'
import { createNav } from '$lib/docs/nav'
import { createContentEntries } from '$lib/docs/content'
import type { ContentEntry } from '$lib/docs/types'

export const load = async () => {
  const mods = import.meta.glob('/src/content/basics/**/*.md', {
    eager: true,
  }) as Record<string, any>
  const entries: ContentEntry[] = createContentEntries(mods, '/basics')


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

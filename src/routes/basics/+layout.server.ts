import { createOrderIndex } from '$lib/docs/order'
import { createNav } from '$lib/docs/nav'
import { basicsEntries } from '$lib/docs/sections/basics'

export const load = async () => {
  const entries = basicsEntries()


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

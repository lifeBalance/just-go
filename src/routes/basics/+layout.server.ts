import { createOrderIndex } from '$lib/docs/order'
import { createNav } from '$lib/docs/nav'
import { createSection } from '$lib/docs/section'

export const load = async () => {
  const { entries } = createSection('basics')
  const list = entries()


  // Optional order config
  const orderMod = import.meta.glob('/src/content/basics/_sidebar.json', {
    eager: true,
  }) as Record<string, any>
  const orderIndex = createOrderIndex(
    orderMod,
    '/src/content/basics/_sidebar.json',
  )

  const { nav } = createNav(list, '/basics', orderIndex)
  return { nav }
}

import { createSection } from '$lib/docs/section'

export const load = async () => {
  const section = createSection('design-patterns')
  const { nav } = section.nav()
  return { nav }
}

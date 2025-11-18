import { createSection } from '$lib/docs/section'

export const load = async () => {
  const section = createSection('basics')
  const { nav } = section.nav()
  return { nav }
}

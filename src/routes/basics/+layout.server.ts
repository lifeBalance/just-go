import { createSection } from '$lib/docs/section'

export const load = async ({ url }: { url: URL }) => {
  const section = createSection('basics')
  const { nav } = section.nav()
  return { nav, path: url.pathname }
}

import { error, redirect } from '@sveltejs/kit'
import { createSection } from '$lib/docs/section'

export const load = ({ params }: { params: { page?: string } }) => {
  const segment = params.page ?? ''
  const section = createSection('svelte-doc')
  const resolve = section.resolver()
  const { nav } = section.nav()

  if (resolve(segment)) {
    return { segment }
  }

  const parts = (segment || '').split('/').filter(Boolean)

  if (parts.length === 0) {
    const first = nav[0]?.items[0]?.url
    if (first) throw redirect(302, first)
    throw error(404, 'No docs in section')
  }

  if (parts.length === 1) {
    const dir = parts[0]
    const group = nav.find((g: any) => g.dir === dir)
    const first = group?.items[0]?.url
    if (first) throw redirect(302, first)
    throw error(404, 'No docs in group')
  }

  throw error(404, 'Not found')
}

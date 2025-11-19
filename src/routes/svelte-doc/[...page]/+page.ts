import { error, redirect } from '@sveltejs/kit'
import { createSection } from '$lib/docs/section'

export const load = ({ params, url }: { params: { page?: string }; url: URL }) => {
  const segment = params.page ?? ''
  const section = createSection('svelte-doc')
  const resolve = section.resolver()
  const { nav } = section.nav()

  // If direct doc exists, render it
  if (resolve(segment)) {
    return { segment, nav, path: url.pathname }
  }

  const parts = (segment || '').split('/').filter(Boolean)

  // Root of section: redirect to first listed item
  if (parts.length === 0) {
    const first = nav[0]?.items[0]?.url
    if (first) throw redirect(302, first)
    throw error(404, 'No docs in section')
  }

  // Group root: redirect to first item in that group
  if (parts.length === 1) {
    const dir = parts[0]
    const group = nav.find((g: any) => g.dir === dir)
    const first = group?.items[0]?.url
    if (first) throw redirect(302, first)
    throw error(404, 'No docs in group')
  }

  // Otherwise not found
  throw error(404, 'Not found')
}

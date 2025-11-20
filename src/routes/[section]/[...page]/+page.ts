import { error, redirect } from '@sveltejs/kit'
import { createSection } from '$lib/docs/section'
import { resolveOrNext } from '$lib/docs/routing'

export const load = ({ params, url }: { params: { section: string; page?: string }; url: URL }) => {
  const sectionName = params.section
  const segment = params.page ?? ''
  const section = createSection(sectionName)
  const result = resolveOrNext(section, segment)

  if (result.kind === 'ok') {
    return { section: sectionName, segment: result.segment, nav: result.nav, path: url.pathname }
  }
  if (result.kind === 'redirect') {
    throw redirect(302, result.url)
  }
  throw error(404, 'Not found')
}

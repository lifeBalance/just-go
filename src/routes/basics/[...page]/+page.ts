import { error } from '@sveltejs/kit'
import { createSection } from '$lib/docs/section'

export const load = ({ params }: { params: { page?: string } }) => {
  const segment = params.page ?? ''
  const resolve = createSection('basics').resolver()
  if (!resolve(segment)) {
    throw error(404, 'Not found')
  }
  return { segment }
}

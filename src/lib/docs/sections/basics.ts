import { createContentEntries } from '../content'
import { makeResolver, type MdModule } from '../resolver'
import type { ContentEntry } from '../types'

export const basicsMods = import.meta.glob('/src/content/basics/**/*.md', {
  eager: true,
}) as Record<string, MdModule>

export function basicsEntries(): ContentEntry[] {
  return createContentEntries(basicsMods, '/basics')
}

export function basicsResolver() {
  return makeResolver(basicsMods, '/basics')
}

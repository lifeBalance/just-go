import { createContentEntries } from './content'
import { makeResolver, type MdModule } from './resolver'
import type { ContentEntry } from './types'

// Glob all content once; filter by section at runtime
const allMods = import.meta.glob('/src/content/**/*.md', {
  eager: true,
}) as Record<string, MdModule>

function filterMods(section: string): Record<string, MdModule> {
  const sec = section.replace(/^\/+|\/+$/g, '')
  const prefix = `/src/content/${sec}/`
  return Object.fromEntries(
    Object.entries(allMods).filter(([fs]) => fs.startsWith(prefix)),
  )
}

export function createSection(section: string) {
  const base = `/${section.replace(/^\/+|\/+$/g, '')}`
  const mods = filterMods(section)
  return {
    base,
    entries(): ContentEntry[] {
      return createContentEntries(mods, base)
    },
    resolver() {
      return makeResolver(mods, base)
    },
  }
}

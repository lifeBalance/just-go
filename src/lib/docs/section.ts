import { createContentEntries } from './content'
import { makeResolver, type MdModule } from './resolver'
import { createOrderIndex } from './order'
import { createNav } from './nav'
import type { ContentEntry, NavGroup } from './types'

// Glob all content once; filter by section at runtime
const allMods = import.meta.glob('/src/content/**/*.md', {
  eager: true,
}) as Record<string, MdModule>
// Glob all sidebars once; filter by section path
const allSidebars = import.meta.glob('/src/content/**/_sidebar.json', {
  eager: true,
}) as Record<string, any>

function filterMods(section: string): Record<string, MdModule> {
  const sec = section.replace(/^\/+|\/+$/g, '')
  const prefix = `/src/content/${sec}/`
  return Object.fromEntries(
    Object.entries(allMods).filter(([fs]) => fs.startsWith(prefix)),
  )
}

export function createSection(
  section: string,
  opts?: { orderFileName?: string },
) {
  const orderFileName = opts?.orderFileName ?? '_sidebar.json'
  const sec = section.replace(/^\/+|\/+$/g, '')
  const base = `/${sec}`
  const contentRoot = `/src/content/${sec}`
  const sidebarPath = `${contentRoot}/${orderFileName}`
  const mods = filterMods(section)
  return {
    base,
    entries(): ContentEntry[] {
      return createContentEntries(mods, base)
    },
    resolver() {
      return makeResolver(mods, base)
    },
    orderIndex(): Map<string, number> {
      return createOrderIndex(allSidebars, sidebarPath)
    },
    nav(): { nav: NavGroup[] } {
      const entries = this.entries()
      const orderIndex = this.orderIndex()
      return createNav(entries, base, orderIndex)
    },
  }
}

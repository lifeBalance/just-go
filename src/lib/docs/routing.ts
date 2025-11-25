import type { NavGroup } from './types'

export type FlatNavItem = { url: string; title: string }

function flattenNav(nav: NavGroup[]): FlatNavItem[] {
  const items: FlatNavItem[] = []
  for (const g of nav) {
    if ((g as any).href && (!g.items || g.items.length === 0)) {
      items.push({ url: (g as any).href, title: g.label })
    } else {
      for (const it of g.items) items.push({ url: it.url, title: it.title })
    }
  }
  return items
}

function normalizePath(path: string) {
  return path.replace(/\/$/, '')
}

export function getPrevNext(nav: NavGroup[], currentPath: string): { prev?: FlatNavItem; next?: FlatNavItem } {
  const flat = flattenNav(nav)
  const idx = flat.findIndex((i) => normalizePath(i.url) === normalizePath(currentPath))
  if (idx === -1) return {}
  return {
    prev: idx > 0 ? flat[idx - 1] : undefined,
    next: idx < flat.length - 1 ? flat[idx + 1] : undefined,
  }
}

function classifySegment(segment: string): 'root' | 'group' | 'doc' {
  const parts = (segment || '').split('/').filter(Boolean)
  if (parts.length === 0) return 'root'
  if (parts.length === 1) return 'group'
  return 'doc'
}

function firstUrlForSection(nav: NavGroup[]): string | undefined {
  const first = nav[0]
  if (!first) return undefined
  return first.items[0]?.url ?? (first as any).href
}

function firstUrlForGroup(nav: NavGroup[], dir: string): string | undefined {
  const group = nav.find((g) => g.dir === dir)
  if (!group) return undefined
  return group.items[0]?.url ?? (group as any).href
}

import type { createSection } from './section'

export function resolveOrNext(
  section: ReturnType<typeof createSection>,
  segment: string,
):
  | { kind: 'ok'; segment: string; nav: NavGroup[] }
  | { kind: 'redirect'; url: string; nav: NavGroup[] }
  | { kind: 'not_found'; nav: NavGroup[] } {
  const resolve = section.resolver()
  const { nav } = section.nav()

  if (resolve(segment)) {
    return { kind: 'ok', segment, nav }
  }

  const kind = classifySegment(segment)
  if (kind === 'root') {
    const url = firstUrlForSection(nav)
    if (url) return { kind: 'redirect', url, nav }
    return { kind: 'not_found', nav }
  }

  if (kind === 'group') {
    const dir = (segment || '').split('/').filter(Boolean)[0]
    const url = firstUrlForGroup(nav, dir)
    if (url) return { kind: 'redirect', url, nav }
    return { kind: 'not_found', nav }
  }

  return { kind: 'not_found', nav }
}

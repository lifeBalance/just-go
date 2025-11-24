import type { NavGroup } from './types'

export type FlatNavItem = { url: string; title: string }

export function flattenNav(nav: NavGroup[]): FlatNavItem[] {
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

import type { NavGroup } from './types'
import { createSection } from './section'

export function classifySegment(segment: string): 'root' | 'group' | 'doc' {
  const parts = (segment || '').split('/').filter(Boolean)
  if (parts.length === 0) return 'root'
  if (parts.length === 1) return 'group'
  return 'doc'
}

export function firstUrlForSection(nav: NavGroup[]): string | undefined {
  const first = nav[0]
  if (!first) return undefined
  return first.items[0]?.url ?? (first as any).href
}

export function firstUrlForGroup(nav: NavGroup[], dir: string): string | undefined {
  const group = nav.find((g) => g.dir === dir)
  if (!group) return undefined
  return group.items[0]?.url ?? (group as any).href
}

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

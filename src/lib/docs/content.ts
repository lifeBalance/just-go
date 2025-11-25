import { fsPathToRoute } from './section'
import type { ContentEntry } from './types'

export function createContentEntries(
  mods: Record<string, any>,
  base: string,
): ContentEntry[] {
  const baseNoSlash = base.replace(/^\//, '')
  return Object.entries(mods).map(([fs, mod]) => {
    const isIndex = /\/index\.(md|mdx)$/.test(fs)
    const url = fsPathToRoute(fs)
    const rel = url.replace(new RegExp('^/' + baseNoSlash + '/'), '')
    const dir = rel.split('/').slice(0, -1).join('/') || ''
    const fallbackTitle = isIndex ? (dir || baseNoSlash) : rel.split('/').pop() || ''
    const title = mod?.metadata?.title ?? fallbackTitle
    return { url, dir, title, isIndex, mod }
  })
}

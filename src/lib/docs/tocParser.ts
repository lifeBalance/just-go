export type TocEntry = { path: string; label?: string; hidden?: boolean }

export type TocConfig = {
  ordered: TocEntry[]
  alias: Map<string, string>
  hidden: Set<string>
}

// Normalize group slugs by:
// - Collapsing multiple slashes
// - Stripping leading "./"
// - Ensuring trailing slash to denote a group
function normalizeGroup(slug: string) {
  return slug.replace(/\/+/g, '/').replace(/^(\.\/)+/, '').replace(/\/?$/, '/')
}
// Normalize item slugs by:
// - Collapsing multiple slashes
// - Stripping leading "./"
// - Ensuring NO trailing slash (items)
function normalizeItem(slug: string) {
  return slug.replace(/\/+/g, '/').replace(/^(\.\/)+/, '').replace(/\/$/, '')
}

/**
 * Parse a `_toc.ts` export into a normalized config.
 * - Accepts an array of strings or objects: { path, label?, hidden? }
 * - Normalizes paths (groups end with '/', items do not)
 * - Produces:
 *   - `ordered`: normalized entries preserving provided order
 *   - `alias`:   label overrides lookup
 *   - `hidden`:  set of paths marked as hidden
 */
export function parseTocConfig(raw: unknown): TocConfig {
  const ordered: TocEntry[] = []
  const alias = new Map<string, string>()
  const hidden = new Set<string>()

  if (!raw) return { ordered, alias, hidden }

  if (Array.isArray(raw)) {
    for (const e of raw as any[]) {
      if (typeof e === 'string') {
        const isGroup = /\/$/.test(e)
        const p = isGroup ? normalizeGroup(e) : normalizeItem(e)
        ordered.push({ path: p })
      } else if (e && typeof e === 'object') {
        const obj = e as any
        const pathVal = String(obj.path || '')
        if (!pathVal) continue
        const isGroup = /\/$/.test(pathVal)
        const p = isGroup ? normalizeGroup(pathVal) : normalizeItem(pathVal)
        const entry: TocEntry = { path: p }
        if (typeof obj.label === 'string') {
          alias.set(p, obj.label)
          entry.label = obj.label
        }
        if (obj.hidden === true) {
          hidden.add(p)
          entry.hidden = true
        }
        ordered.push(entry)
      }
    }
    return { ordered, alias, hidden }
  }

  return { ordered, alias, hidden }
}

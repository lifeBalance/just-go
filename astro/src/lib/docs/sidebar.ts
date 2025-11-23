export type SidebarEntry = { path: string; label?: string; hidden?: boolean }

export type SidebarConfig = {
  ordered: SidebarEntry[]
  alias: Map<string, string>
  hidden: Set<string>
}

function normalizeGroup(slug: string) {
  return slug.replace(/\/+/g, '/').replace(/^(\.\/)+/, '').replace(/\/?$/, '/')
}
function normalizeItem(slug: string) {
  return slug.replace(/\/+/g, '/').replace(/^(\.\/)+/, '').replace(/\/$/, '')
}

export function parseSidebarConfig(raw: unknown, folderIsRoot = false): SidebarConfig {
  const ordered: SidebarEntry[] = []
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
        const entry: SidebarEntry = { path: p }
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

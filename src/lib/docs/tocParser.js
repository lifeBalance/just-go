export function parseTocConfig(raw) {
  if (!raw) {
    return {
      ordered: [],
      alias: new Map(),
      hidden: new Set(),
    }
  }

  const entries = Array.isArray(raw) ? raw : raw.default || []
  const ordered = entries.map((entry) => (typeof entry === 'string' ? { path: entry } : entry))
  const alias = new Map()
  const hidden = new Set()

  for (const entry of ordered) {
    if (entry.label) alias.set(entry.path, entry.label)
    if (entry.hidden) hidden.add(entry.path.replace(/\/$/, ''))
  }

  return { ordered, alias, hidden }
}

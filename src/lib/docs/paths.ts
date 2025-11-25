export function normalizePath(path: string): string {
  return path.replace(/\/$/, '')
}

// Convert an absolute content fs path (from MD/MDX file) to a route
// Examples:
//   - /docs/basics/introduction/index.mdx -> /basics/introduction/
//   - /docs/basics/variables/intro.md     -> /basics/variables/intro
export function fsPathToRoute(fsPath: string): string {
  return fsPath
    .replace(/^\/docs/, '')
    .replace(/index\.(md|mdx)$/, '')
    .replace(/\.(md|mdx)$/, '')
}


export type SectionPageParam = { section: string; page: string }

// Build `[section]/[...page]` params from content files
export function listSectionPageParams(): SectionPageParam[] {
  const mods = import.meta.glob('/docs/**/*.{md,mdx}', { eager: true })
  const sections = new Set<string>()
  const out: SectionPageParam[] = []
  for (const fs of Object.keys(mods)) {
    const route = fsPathToRoute(fs)
    const parts = route.split('/').filter(Boolean)
    const section = parts[0] || ''
    const page = parts.slice(1).join('/')
    if (section) sections.add(section)
    if (page) out.push({ section, page })
  }
  // Add section root paths to consolidate routing (page = '')
  for (const section of sections) {
    out.push({ section, page: '' })
  }
  return out
}

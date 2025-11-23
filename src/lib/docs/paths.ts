export function normalizePath(path: string): string {
  return path.replace(/\/$/, '')
}

// Convert an absolute content fs path (from MD file) to a route
// Examples:
//   - /src/content/basics/introduction/index.md -> /basics/introduction/
//   - /src/content/basics/variables/intro.md    -> /basics/variables/intro
export function fsPathToRoute(fsPath: string): string {
  return fsPath
    .replace(/^\/src\/content/, '')
    .replace(/index\.(md|mdx)$/, '')
    .replace(/\.(md|mdx)$/, '')
}

// Turn an absolute route into a section-relative slug
// Example: relSlug('/basics/variables/intro', '/basics') => 'variables/intro'
export function relSlug(route: string, base: string): string {
  const baseNorm = normalizePath(base)
  const routeNorm = normalizePath(route)
  return routeNorm.replace(
    new RegExp('^' + baseNorm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\/'),
    '',
  )
}

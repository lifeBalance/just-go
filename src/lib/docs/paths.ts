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



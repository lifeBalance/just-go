// Central docs configuration
// - basePath: deployment prefix for all docs routes (e.g., '/just-go')
//   If undefined, falls back to import.meta.env.BASE_URL.
// - sections: top-level docs folders under /docs to include in routing.


export type DocsBranch = {
  id: string
  root: string
  globKeys: readonly string[]
  tocGlobKeys: readonly string[]
}

// Default to the build-time base (Astro/Vite sets BASE_URL), trimmed of trailing slash
const defaultBase = (import.meta.env.BASE_URL || '/').replace(/\/$/, '')

// Return a registry of literal globs Vite can statically analyze
export function getGlobRegistry() {
  return {
    docs: import.meta.glob('/docs/**/*.{md,mdx}', { eager: true }) as Record<string, any>,
    tocDoc: import.meta.glob('/toc-doc/**/*.{md,mdx}', { eager: true }) as Record<string, any>,
    docsToc: import.meta.glob('/docs/**/_toc.{ts,js}', { eager: true }) as Record<string, any>,
    tocDocToc: import.meta.glob('/toc-doc/**/_toc.{ts,js}', { eager: true }) as Record<string, any>,
  }
}

export const docsConfig = {
  // Override this if you need a custom deployment base; otherwise uses BASE_URL
  basePath: defaultBase,
  // Each branch maps a public section id to a filesystem root (absolute from project root)
  branches: [
    {
      id: 'basics',
      root: '/docs/basics',
      globKeys: ['docs'],
      tocGlobKeys: ['docsToc'],
    },
    {
      id: 'toc-doc',
      root: '/toc-doc',
      globKeys: ['tocDoc'],
      tocGlobKeys: ['tocDocToc'],
    },
  ] as DocsBranch[],
}

// Central docs configuration
// - basePath: deployment prefix for all docs routes (e.g., '/just-go')
//   If undefined, falls back to import.meta.env.BASE_URL.
// - sections: top-level docs folders under /docs to include in routing.


export type DocsBranch = {
  id: string
  root: string
}

// Default to the build-time base (Astro/Vite sets BASE_URL), trimmed of trailing slash
const defaultBase = (import.meta.env.DEV ? '/' : (import.meta.env.BASE_URL || '/')).replace(/\/$/, '')

// Registry of literal globs keyed by branch id
export function getGlobRegistry() {
  return {
    basics: {
      content: import.meta.glob('/docs/basics/**/*.{md,mdx}', { eager: true }) as Record<string, any>,
      toc: import.meta.glob('/docs/basics/**/_toc.ts', { eager: true }) as Record<string, any>,
    },
    'toc-doc': {
      content: import.meta.glob('/toc-doc/**/*.{md,mdx}', { eager: true }) as Record<string, any>,
      toc: import.meta.glob('/toc-doc/**/_toc.ts', { eager: true }) as Record<string, any>,
    },
  } as Record<string, { content: Record<string, any>; toc: Record<string, any> }>
}

export const docsConfig = {
  // Override this if you need a custom deployment base; otherwise uses BASE_URL
  basePath: defaultBase,
  // Each branch maps a public section id to a filesystem root (absolute from project root)
  branches: [
    { id: 'basics',  root: '/docs/basics' },
    { id: 'toc-doc', root: '/toc-doc' },
  ] as DocsBranch[],
}

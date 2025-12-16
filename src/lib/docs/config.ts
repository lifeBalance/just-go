// Central docs configuration
// - basePath: deployment prefix for all docs routes (e.g., '/just-go')
//   If undefined, falls back to import.meta.env.BASE_URL.
// - sections: top-level docs folders under /docs to include in routing.


export type DocsBranch = { id: string; root: string }

// Default to the build-time base (Astro/Vite sets BASE_URL), trimmed of trailing slash
const defaultBase = (import.meta.env.BASE_URL || '/').replace(/\/$/, '')

export const docsConfig = {
  // Override this if you need a custom deployment base; otherwise uses BASE_URL
  basePath: defaultBase,
  // Each branch maps a public section id to a filesystem root (absolute from project root)
  branches: [
    { id: 'basics',  root: '/docs/basics' },
    { id: 'toc-doc', root: '/docs/toc-doc' },
  ] as DocsBranch[],
}

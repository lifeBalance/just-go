import { docsConfig as resolvedConfig, getGlobRegistry as resolvedRegistry } from 'virtual:docs-config'

const fallbackBranches = [
  { id: 'docs', root: '/docs' },
]

function normalizeBasePath(raw) {
  const envBase = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL)
    ? import.meta.env.BASE_URL
    : '/'
  const base = raw ?? envBase ?? '/'
  const trimmed = base.replace(/\/$/, '')
  return trimmed === '' ? '/' : trimmed
}

const fallbackConfig = {
  basePath: normalizeBasePath(),
  branches: fallbackBranches,
}

export const docsConfig = {
  basePath: normalizeBasePath(resolvedConfig && resolvedConfig.basePath),
  branches: (resolvedConfig && resolvedConfig.branches) || fallbackConfig.branches,
}

const fallbackRegistry = {
  docs: {
    content: import.meta.glob('/docs/**/*.{md,mdx}', { eager: true }),
    toc: import.meta.glob('/docs/**/_toc.ts', { eager: true }),
  },
}

export function getGlobRegistry() {
  if (typeof resolvedRegistry === 'function') {
    return resolvedRegistry()
  }

  return fallbackRegistry
}

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

function ensureLeadingSlash(path) {
  return path.startsWith('/') ? path : `/${path}`
}

function resolveBranchHref(branch, basePath) {
  const sourceHref = branch.href ?? `/${branch.id}`

  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(sourceHref)) {
    return sourceHref
  }

  const normalizedBase = normalizeBasePath(basePath)
  const base = normalizedBase === '/' ? '' : normalizedBase

  if (base && sourceHref.startsWith(base)) {
    return sourceHref
  }

  const normalizedHref = ensureLeadingSlash(sourceHref)
  return `${base}${normalizedHref}` || '/'
}

export const docsConfig = {
  basePath: normalizeBasePath(resolvedConfig && resolvedConfig.basePath),
  branches: ((resolvedConfig && resolvedConfig.branches) || fallbackConfig.branches).map((branch) => ({
    ...branch,
    href: resolveBranchHref(branch, resolvedConfig && resolvedConfig.basePath),
  })),
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

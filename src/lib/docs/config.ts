export type DocsBranch = {
  id: string
  root: string
  title?: string
  subtitle?: string
  href?: string
}

export type GlobRegistry = Record<string, {
  content: Record<string, any>
  toc: Record<string, any>
}>

const fallbackBranches: DocsBranch[] = [
  { id: 'docs', root: '/docs', title: 'Docs', subtitle: '', href: '/docs' },
]

type DocsConfigModule = {
  basePath?: string
  branches?: DocsBranch[]
  summaries?: Record<string, { title: string; subtitle?: string; href?: string }>
}

let resolvedConfig: DocsConfigModule = {}
let resolvedRegistry: (() => GlobRegistry) | undefined
let resolvedSummaries: Record<string, { title: string; subtitle?: string; href?: string }> = {}

try {
  const mod = await import('virtual:docs-config')
  resolvedConfig = (mod as any).docsConfig ?? {}
  resolvedRegistry = (mod as any).getGlobRegistry
  resolvedSummaries = (mod as any).docsSummaries ?? {}
} catch (err) {
  resolvedConfig = {}
  resolvedRegistry = undefined
  resolvedSummaries = {}
}

function normalizeBasePath(raw?: string): string {
  const envBase = typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL
    ? import.meta.env.BASE_URL
    : '/'
  const base = raw ?? envBase
  const trimmed = base.replace(/\/$/, '')
  return trimmed === '' ? '/' : trimmed
}

const fallbackConfig = {
  basePath: normalizeBasePath(),
  branches: fallbackBranches,
}

const fallbackRegistry: GlobRegistry = {
  docs: {
    content: import.meta.glob('/docs/**/*.{md,mdx}', { eager: true }),
    toc: import.meta.glob('/docs/**/_toc.ts', { eager: true }),
  },
}

export const docsConfig = {
  basePath: normalizeBasePath(resolvedConfig?.basePath),
  branches: ((resolvedConfig?.branches as DocsBranch[] | undefined) ?? fallbackConfig.branches).map((branch) => ({
    ...branch,
    title: branch.title ?? resolvedSummaries[branch.id]?.title ?? branch.id,
    subtitle: branch.subtitle ?? resolvedSummaries[branch.id]?.subtitle ?? '',
    href: branch.href ?? resolvedSummaries[branch.id]?.href ?? `/${branch.id}`,
  })),
  summaries: resolvedSummaries,
}

export function getGlobRegistry(): GlobRegistry {
  if (typeof resolvedRegistry === 'function') return resolvedRegistry()

  return fallbackRegistry
}

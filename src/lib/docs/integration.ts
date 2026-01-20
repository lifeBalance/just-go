import type { AstroIntegration } from 'astro'

const MODULE_ID = 'virtual:docs-config'
const RESOLVED_ID = '\0virtual:docs-config'

type DocsSection = {
  id: string
  root: string
  title?: string
  subtitle?: string
  href?: string
}

type DocsIntegrationOptions = {
  basePath?: string
  sections?: DocsSection[]
}

function normalizeRoot(root: string): string {
  const sanitized = root.replace(/\\/g, '/').replace(/^\.\//, '')
  const withLeading = sanitized.startsWith('/') ? sanitized : `/${sanitized}`
  return withLeading.replace(/\/$/, '')
}

function createDocsVirtualModule(options: DocsIntegrationOptions = {}) {
  const sections = (options.sections ?? [{ id: 'docs', root: '/docs' }]).map((section) => ({
    ...section,
    root: normalizeRoot(section.root),
  }))

  const baseExpr = options.basePath === undefined ? 'undefined' : JSON.stringify(options.basePath)
  const sectionsJson = JSON.stringify(sections, null, 2)
  const registryBody = sections
    .map((section) => {
      const contentGlob = `${section.root}/**/*.{md,mdx}`
      const tocGlob = `${section.root}/**/_toc.ts`
      return `'${section.id}': {
    content: import.meta.glob(${JSON.stringify(contentGlob)}, { eager: true }),
    toc: import.meta.glob(${JSON.stringify(tocGlob)}, { eager: true }),
  }`
    })
    .join(',\n')

  const summaryJson = JSON.stringify(
    sections.reduce<Record<string, { title: string; subtitle?: string; href?: string }>>((acc, section) => {
      acc[section.id] = {
        title: section.title ?? section.id,
        subtitle: section.subtitle,
        href: section.href,
      }
      return acc
    }, {})
  )

  return {
    name: 'docs-virtual-config',
    enforce: 'pre' as const,
    resolveId(id: string) {
      if (id === MODULE_ID) return RESOLVED_ID
      return null
    },
    load(id: string) {
      if (id !== RESOLVED_ID) return null

      return `const basePath = ${baseExpr};
const branches = ${sectionsJson};
const summaries = ${summaryJson};

export const docsConfig = { basePath, branches };
export const docsSummaries = summaries;
export function getGlobRegistry() {
  return {${registryBody ? `\n    ${registryBody}\n` : ''}  };
}
`
    },
  }
}

export default function docsIntegration(options: DocsIntegrationOptions = {}): AstroIntegration {
  return {
    name: 'docs-integration',
    hooks: {
      'astro:config:setup'({ updateConfig }) {
        updateConfig({
          vite: {
            plugins: [createDocsVirtualModule(options)],
          },
        })
      },
    },
  }
}

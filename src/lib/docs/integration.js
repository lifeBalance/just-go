const MODULE_ID = 'virtual:docs-config'
const RESOLVED_ID = '\0virtual:docs-config'

function normalizeRoot(root) {
  const sanitized = root.replace(/\\/g, '/').replace(/^\.\//, '')
  const withLeading = sanitized.startsWith('/') ? sanitized : `/${sanitized}`
  return withLeading.replace(/\/$/, '')
}

function createDocsVirtualModule(options = {}) {
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
    sections.reduce((acc, section) => {
      acc[section.id] = {
        title: section.title ?? section.id,
        subtitle: section.subtitle ?? '',
        href: section.href ?? undefined,
      }
      return acc
    }, {})
  )

  return {
    name: 'docs-virtual-config',
    enforce: 'pre',
    resolveId(id) {
      if (id === MODULE_ID) return RESOLVED_ID
      return null
    },
    load(id) {
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

export function docsIntegration(options = {}) {
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

export default docsIntegration

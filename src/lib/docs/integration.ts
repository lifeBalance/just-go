import type { AstroIntegration } from 'astro'
import { promises as fs } from 'node:fs'
import path from 'node:path'

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

const MODULE_ID = 'virtual:docs-config'
const RESOLVED_ID = '\0virtual:docs-config'
const MANIFEST_DIR = '.asterism'
const MANIFEST_FILE = 'sections.json'

function normalizeRoot(root: string): string {
  const sanitized = root.replace(/\\/g, '/').replace(/^\.\//, '')
  const withLeading = sanitized.startsWith('/') ? sanitized : `/${sanitized}`
  return withLeading.replace(/\/$/, '')
}

function normalizeSections(sections?: DocsSection[]): DocsSection[] {
  return (sections ?? [{ id: 'docs', root: '/docs' }]).map((section) => ({
    ...section,
    root: normalizeRoot(section.root),
  }))
}

async function writeSectionsManifest(sections: DocsSection[]) {
  const cwd = process.cwd()
  const manifestDir = path.join(cwd, MANIFEST_DIR)
  const manifestPath = path.join(manifestDir, MANIFEST_FILE)
  const payload = JSON.stringify(sections, null, 2)

  await fs.mkdir(manifestDir, { recursive: true })
  await fs.writeFile(manifestPath, payload, 'utf8')
}

function createDocsVirtualModule(sections: DocsSection[], basePath?: string) {
  const baseExpr = basePath === undefined ? 'undefined' : JSON.stringify(basePath)
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
  const sections = normalizeSections(options.sections)

  return {
    name: 'docs-integration',
    hooks: {
      'astro:config:setup': async ({ updateConfig }) => {
        await writeSectionsManifest(sections)

        updateConfig({
          vite: {
            plugins: [createDocsVirtualModule(sections, options.basePath)],
          },
        })
      },
    },
  }
}

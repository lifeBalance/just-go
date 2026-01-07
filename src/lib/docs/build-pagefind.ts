#!/usr/bin/env tsx
import * as pagefind from 'pagefind'
import { promises as fs } from 'node:fs'
import path from 'node:path'

const DEFAULT_BRANCHES = ['basics', 'toc-doc']
const branchIds = (process.env.PAGEFIND_BRANCHES?.split(',')
  .map((id) => id.trim())
  .filter(Boolean) ?? DEFAULT_BRANCHES)

async function exists(p: string) {
  try {
    await fs.stat(p)
    return true
  } catch {
    return false
  }
}

async function ensureCleanDir(dir: string) {
  await fs.rm(dir, { recursive: true, force: true })
  await fs.mkdir(dir, { recursive: true })
}

async function copyDir(src: string, dest: string) {
  await fs.mkdir(dest, { recursive: true })
  const entries = await fs.readdir(src, { withFileTypes: true })
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath)
    } else {
      await fs.copyFile(srcPath, destPath)
    }
  }
}

async function buildBranchIndex(branchId: string, sectionDist: string, distDir: string, publicDir: string, repoRoot: string) {
  const res = await pagefind.createIndex()
  const index = (res as any).index
  let pageCount = 0

  try {
    const sectionGlob = `${branchId}/**/*.html`
    const { errors, page_count } = await index.addDirectory({
      path: distDir,
      glob: sectionGlob,
    })
    if (errors?.length) {
      console.error(`Pagefind errors for ${branchId}:`, errors)
    }
    pageCount = page_count ?? 0

    const outputSubdir = `pagefind-${branchId}`
    const distOutput = path.join(distDir, outputSubdir)
    const publicOutput = path.join(publicDir, outputSubdir)

    await ensureCleanDir(distOutput)
    await ensureCleanDir(publicOutput)

    await index.writeFiles({ outputPath: distOutput })
    await copyDir(distOutput, publicOutput)

    console.log(`Indexed ${branchId} (${pageCount} pages) → ${path.relative(repoRoot, distOutput)} and copied to ${path.relative(repoRoot, publicOutput)}`)
  } finally {
    await index.deleteIndex()
  }

  return pageCount
}

async function main() {
  const repoRoot = process.cwd()
  const distDir = path.join(repoRoot, 'dist')
  const publicDir = path.join(repoRoot, 'public')

  if (!(await exists(distDir))) {
    console.error('dist/ not found. Run `npm run build` first.')
    process.exit(1)
  }

  await fs.mkdir(publicDir, { recursive: true })

  try {
    for (const branchId of branchIds) {
      const sectionDist = path.join(distDir, branchId)
      if (!(await exists(sectionDist))) {
        console.warn(`Skipping ${branchId}: ${sectionDist} not found in dist/`)
        continue
      }

      await buildBranchIndex(branchId, sectionDist, distDir, publicDir, repoRoot)
    }
  } finally {
    if (typeof pagefind.close === 'function') {
      try {
        await pagefind.close()
      } catch (err) {
        console.warn('Failed to close Pagefind worker cleanly:', err)
      }
    }
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

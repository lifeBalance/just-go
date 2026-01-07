#!/usr/bin/env tsx
import { docsConfig } from './config.ts'
import { spawn } from 'node:child_process'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import os from 'node:os'

async function exists(p: string) {
  try { await fs.stat(p); return true } catch { return false }
}

async function cp(src: string, dest: string) {
  // Node 18+: fs.cp is available; fallback to recursive copy
  // @ts-ignore
  if (typeof (fs as any).cp === 'function') {
    // @ts-ignore
    await (fs as any).cp(src, dest, { recursive: true })
    return
  }
  async function copyDir(s: string, d: string) {
    await fs.mkdir(d, { recursive: true })
    const entries = await fs.readdir(s, { withFileTypes: true })
    for (const e of entries) {
      const sp = path.join(s, e.name)
      const dp = path.join(d, e.name)
      if (e.isDirectory()) await copyDir(sp, dp)
      else await fs.copyFile(sp, dp)
    }
  }
  const stat = await fs.stat(src)
  if (stat.isDirectory()) await copyDir(src, dest)
  else {
    await fs.mkdir(path.dirname(dest), { recursive: true })
    await fs.copyFile(src, dest)
  }
}

function run(cmd: string, args: string[], cwd: string) {
  return new Promise<void>((resolve, reject) => {
    const p = spawn(cmd, args, { cwd, stdio: 'inherit' })
    p.on('error', reject)
    p.on('exit', (code) => code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`)))
  })
}

async function main() {
  const repoRoot = process.cwd()
  const distDir = path.join(repoRoot, 'dist')
  const publicDir = path.join(repoRoot, 'public')
  if (!(await exists(distDir))) {
    console.error('dist/ not found. Run `npm run build` first.')
    process.exit(1)
  }
  const pagefindBin = path.join(repoRoot, 'node_modules', '.bin', process.platform === 'win32' ? 'pagefind.cmd' : 'pagefind')
  if (!(await exists(pagefindBin))) {
    console.error('Pagefind binary not found. Install with `npm i pagefind`.')
    process.exit(1)
  }

  for (const br of docsConfig.branches) {
    const id = br.id
    const sectionDist = path.join(distDir, id)
    if (!(await exists(sectionDist))) {
      console.warn(`Skipping ${id}: ${sectionDist} not found in dist/`) 
      continue
    }
    const tmpBase = await fs.mkdtemp(path.join(os.tmpdir(), `pf-${id}-`))
    const tmpSite = path.join(tmpBase, id)
    await cp(sectionDist, tmpSite)

    // Run pagefind on tmpSite, output under a distinct subdir
    const outputSubdir = `pagefind-${id}`
    await run(pagefindBin, ['--site', tmpBase, '--output-subdir', outputSubdir], repoRoot)

    const from = path.join(tmpBase, outputSubdir)
    const toDist = path.join(distDir, outputSubdir)
    const toPublic = path.join(publicDir, outputSubdir)

    await fs.mkdir(distDir, { recursive: true })
    await fs.mkdir(publicDir, { recursive: true })

    await cp(from, toDist)
    await cp(from, toPublic)

    console.log(`Indexed ${id} → ${path.relative(repoRoot, toDist)} and copied to ${path.relative(repoRoot, toPublic)}`)
  }
}

main().catch((err) => { console.error(err); process.exit(1) })

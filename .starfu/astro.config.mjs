// @ts-check
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@astrojs/mdx'
import expressiveCode from 'astro-expressive-code'
import icons from 'astro-icon'
import docsIntegration from './src/lib/docs/integration'

const alias = {
  '@styles': '/src/styles',
  '@layouts': '/src/layouts',
  '@components': '/src/components',
  '@utils': '/src/utils',
  '@assets': '/src/assets',
  '@lib': '/src/lib',
}

// Values set by CLI, overridable via env vars for development
const starfuConfig = {
  title: process.env.STARFU_TITLE || 'Just Go!',
  platform: process.env.STARFU_PLATFORM || 'github',
  username: process.env.STARFU_USERNAME || 'lifeBalance',
  repo: process.env.STARFU_REPO || 'just-go',
  docsRoot: process.env.STARFU_DOCS_ROOT || '../docs',
  outDir: process.env.STARFU_OUT_DIR || 'dist',
}

function getSite() {
  const platform = starfuConfig.platform
  const username = starfuConfig.username
  const repo = starfuConfig.repo
  const domain = platform === 'gitlab' ? 'gitlab.io' : 'github.io'
  // We'll need a switch statement for the domain here
  return `https://${username}.${domain}/${repo}/`
}

function getBase() {
  return `/${starfuConfig.repo}/`
}

export default defineConfig({
  site: getSite(),
  base: getBase(),
  outDir: starfuConfig.outDir,
  integrations: [
    expressiveCode(),
    mdx(),
    icons(),
    docsIntegration({
      title: starfuConfig.title,
      repo: {
        platform: starfuConfig.platform,
        username: starfuConfig.username,
        name: starfuConfig.repo,
      },
      sections: [
        {
          root: '../docs/basics',
          title: 'Basics',
          subtitle: 'Language fundamentals',
          href: '/basics/introduction/overview',
        },
        {
          root: '../docs/concurrency',
          title: 'Concurrency',
          subtitle: 'Manage multiple tasks running simultaneously',
          href: '/concurrency/intro/intro',
        },
        {
          root: '../docs/url-shortener',
          title: 'Project: URL Shortener',
          subtitle: 'Shorten URLs and generate short links',
          href: '/url-shortener/intro',
        },
      ],
    }),
  ],
  vite: { plugins: [tailwindcss()], resolve: { alias } },
})

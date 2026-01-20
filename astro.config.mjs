// @ts-check
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import svelte from '@astrojs/svelte'
import mdx from '@astrojs/mdx'
import expressiveCode from 'astro-expressive-code'
import icons from 'astro-icon'
import docsIntegration from './src/lib/docs/integration.js'

// Vite alias aligned with your tsconfig
const alias = {
  '@styles': '/src/styles',
  '@layouts': '/src/layouts',
  '@components': '/src/components',
  '@utils': '/src/utils',
  '@assets': '/src/assets',
  '@lib': '/src/lib',
}

export default defineConfig({
  site: 'https://lifebalance.github.io/just-go',
  base: '/just-go/',
  integrations: [
    svelte(),
    expressiveCode(),
    mdx(),
    icons(),
    docsIntegration({
      sections: [
        {
          id: 'basics',
          root: '/docs/basics',
          title: 'Basics',
          subtitle: 'Language fundamentals',
        },
        {
          id: 'toc-doc',
          root: '/toc-doc',
          title: 'Toc-Doc',
          subtitle: 'Build doc sites with different roots',
        },
        {
          id: 'test',
          root: '/docs/test',
          title: 'Test',
          subtitle: 'Test refactor',
        },
      ],
    }),
  ],
  vite: { plugins: [tailwindcss()], resolve: { alias } },
})

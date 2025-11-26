// @ts-check
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import svelte from '@astrojs/svelte'
import mdx from '@astrojs/mdx'
import expressiveCode from 'astro-expressive-code'
import icons from 'astro-icon'
import ecConfig from './src/expressive-code.config.mjs'

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
  integrations: [svelte(), expressiveCode(ecConfig), mdx(), icons()],
  vite: { plugins: [tailwindcss()], resolve: { alias } },
})

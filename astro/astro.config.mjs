// @ts-check
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import svelte from '@astrojs/svelte'
import mdx from '@astrojs/mdx'

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
  integrations: [svelte(), mdx()],
  vite: { plugins: [tailwindcss()], resolve: { alias } },
})

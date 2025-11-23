// @ts-check
import { defineConfig } from 'astro/config'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import svelte from '@astrojs/svelte'

// Vite alias aligned with your tsconfig
const alias = {
  '@styles': fileURLToPath(new URL('./src/styles', import.meta.url)),
  '@layouts': fileURLToPath(new URL('./src/layouts', import.meta.url)),
  '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
  '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
  '@assets': fileURLToPath(new URL('./src/lib/assets', import.meta.url)),
  '$lib': fileURLToPath(new URL('./src/lib', import.meta.url)),
}

export default defineConfig({
  integrations: [svelte()],
  vite: { plugins: [tailwindcss()], resolve: { alias } },
})

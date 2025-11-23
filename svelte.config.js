import adapter from '@sveltejs/adapter-auto'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import { mdsvex } from 'mdsvex'
import rehypeExpressiveCode from 'rehype-expressive-code'
import { expressiveCodeOptions } from './src/lib/expressive-code.config.js'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.md', '.mdx'],
  preprocess: [
    vitePreprocess(),
    mdsvex({
      extensions: ['.md', '.mdx'],
      highlight: false,
      rehypePlugins: [[rehypeExpressiveCode, expressiveCodeOptions]],
    }),
  ],
  kit: {
    adapter: adapter(),
  },
}

export default config

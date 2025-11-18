import adapter from '@sveltejs/adapter-auto'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import { mdsvex } from 'mdsvex'
import remarkExpressiveCode from 'remark-expressive-code'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.md'],
  preprocess: [
    vitePreprocess(),
    mdsvex({
      extensions: ['.md'],
      remarkPlugins: [
        [
          remarkExpressiveCode,
          {
            themes: ['github-dark'],
          },
        ],
      ],
    }),
  ],
  kit: {
    adapter: adapter(),
  },
}

export default config

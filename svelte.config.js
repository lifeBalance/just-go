import adapter from '@sveltejs/adapter-auto'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import { mdsvex } from 'mdsvex'
import rehypeExpressiveCode from 'rehype-expressive-code'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.md', '.mdx'],
  preprocess: [
    vitePreprocess(),
    mdsvex({
      extensions: ['.md', '.mdx'],
      highlight: false,
      rehypePlugins: [
        [
          rehypeExpressiveCode,
          {
            themes: ['dracula', 'catppuccin-latte'],
            themeCssSelector: (theme) => {
              return theme.name === 'dracula'
                ? ':root:not([data-theme="dark"])'
                : ':root[data-theme="dark"]'
            },
            useDarkModeMediaQuery: false,
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

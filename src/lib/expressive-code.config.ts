// Shared Expressive Code configuration used by mdsvex (rehype plugin)
// and the SSR Code.svelte component.

import type { ThemeSetting } from "expressive-code"

/** @type {import('@sveltejs/kit').Config} */
export const expressiveCodeOptions = {
  themes: ['dracula', 'catppuccin-latte'],
  escapeEntities: false,
  // Keep theme selection aligned with your site theme toggle
  // (dark vs light via data-theme on <html>)
  themeCssSelector: (/** @type {any} */ theme: ThemeSetting) => {
    return theme.name === 'dracula'
      ? ':root:not([data-theme="dark"])'
      : ':root[data-theme="dark"]'
  },
  useDarkModeMediaQuery: false,
  frames: { showCopyToClipboardButton: false },
}

export const expressiveCodeThemeNames = expressiveCodeOptions.themes

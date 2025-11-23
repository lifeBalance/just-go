// Svelte action + helpers for reading and setting the theme
// Copied from SvelteKit app for reuse in Astro

export type ThemeValue = 'dark' | 'light'
export type ThemeActionParams = {
  onChange?: (isDark: boolean) => void
  immediate?: boolean // default true: emit initial state on mount
}

const ROOT = () => document.documentElement
const ATTR = 'data-theme'

export function getTheme(): ThemeValue {
  const isDark = ROOT().getAttribute(ATTR) === 'dark'
  return isDark ? 'dark' : 'light'
}

export function setTheme(value: ThemeValue | boolean): void {
  const root = ROOT()
  const dark = value === 'dark' || value === true
  if (dark) {
    root.setAttribute(ATTR, 'dark')
    try {
      localStorage.setItem('theme', 'dark')
    } catch {}
  } else {
    root.removeAttribute(ATTR)
    try {
      localStorage.removeItem('theme')
    } catch {}
  }
}

export function toggleTheme(): void {
  setTheme(getTheme() !== 'dark')
}

export function theme(node: HTMLElement, params?: ThemeActionParams) {
  const root = ROOT()

  const notify = () => {
    const isDark = root.getAttribute(ATTR) === 'dark'
    node.dispatchEvent(
      new CustomEvent('themechange', {
        detail: { dark: isDark, theme: isDark ? 'dark' : 'light' as ThemeValue },
      }),
    )
    params?.onChange?.(isDark)
  }

  if (params?.immediate !== false) notify()

  const mo = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.attributeName === ATTR) {
        notify()
        break
      }
    }
  })
  mo.observe(root, { attributes: true, attributeFilter: [ATTR] })

  return {
    destroy() {
      mo.disconnect()
    },
  }
}

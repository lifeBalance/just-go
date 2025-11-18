<script lang="ts">
  import { onMount } from 'svelte'
  let dark = false

  function applyTheme() {
    const root = document.documentElement
    if (dark) {
      root.setAttribute('data-theme', 'dark')
      try {
        localStorage.setItem('theme', 'dark')
      } catch {}
    } else {
      root.removeAttribute('data-theme')
      try {
        localStorage.removeItem('theme')
      } catch {}
    }
  }

  function toggle() {
    dark = !dark
    applyTheme()
  }

  onMount(() => {
    try {
      const saved = localStorage.getItem('theme')
      if (saved === 'dark') dark = true
    } catch {}
    // Fall back to current attribute
    if (document.documentElement.getAttribute('data-theme') === 'dark') {
      dark = true
    }
    applyTheme()
  })
</script>

<button
  type="button"
  on:click={toggle}
  aria-label="Toggle theme"
  class="inline-flex items-center gap-2 px-2 py-1 rounded-md no-underline text-(--sd-fg) hover:bg-(--sd-hover)"
>
  <span aria-hidden="true">{dark ? '🌙' : '🌤️'}</span>
  <span>{dark ? 'Dark' : 'Light'}</span>
</button>

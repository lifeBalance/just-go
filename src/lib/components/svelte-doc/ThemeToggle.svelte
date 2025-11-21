<script lang="ts">
  import Icon from '@iconify/svelte'
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
  class="inline-flex items-center gap-2 px-2 py-1 rounded-md no-underline text-(--sd-fg) hover:bg-(--sd-hover) hover:cursor-pointer transition"
>
  <span aria-hidden="true"
    ><Icon
      class="text-2xl"
      icon={dark ? 'mdi:moon-waning-crescent' : 'mdi:white-balance-sunny'}
    /></span
  >
</button>

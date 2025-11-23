<script lang="ts">
  import Icon from '@iconify/svelte'
  import { onMount } from 'svelte'
  import { theme, setTheme, toggleTheme } from '$lib/actions/theme'
  let dark = $state<boolean>(false)

  function toggle() {
    toggleTheme()
  }

  onMount(() => {
    try {
      const saved = localStorage.getItem('theme')
      if (saved === 'dark') setTheme('dark')
    } catch {}
  })
</script>

<button
  type="button"
  use:theme={{ onChange: (isDark) => (dark = isDark) }}
  onclick={toggle}
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

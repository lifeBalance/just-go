<script lang="ts">
  import Logo from './Logo.svelte'
  import ThemeToggle from './ThemeToggle.svelte'
  export let homeHref: string = '/'
  export let currentPath: string = ''
</script>

<nav class="flex items-center justify-between px-4 py-2 bg-(--sd-bg) text-(--sd-fg) border-b border-(--sd-border)">
  <Logo href={homeHref} label="Home" {currentPath} />
  <ThemeToggle />
</nav>

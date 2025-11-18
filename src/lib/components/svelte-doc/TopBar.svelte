<script lang="ts">
  import Logo from './Logo.svelte'
  import ThemeToggle from './ThemeToggle.svelte'
  export let homeHref: string = '/'
  export let currentPath: string = ''
</script>

<nav class="flex items-center justify-between px-4 py-2 bg-sd-bg text-sd-fg border-b border-sd-border">
  <Logo href={homeHref} label="Home" {currentPath} />
  <div class="flex items-center gap-3">
    <a href="/colors" class="text-sm no-underline text-sd-muted hover:text-sd-accent">Colors</a>
    <ThemeToggle />
  </div>
</nav>

<script lang="ts">
  import '../app.css'
  import favicon from '$lib/assets/gopher.png'
  import TopBar from '$lib/components/svelte-doc/TopBar.svelte'
  import Logo from '$lib/components/svelte-doc/Logo.svelte'
  import ThemeToggle from '$lib/components/svelte-doc/ThemeToggle.svelte'
  import gopher from '$lib/assets/gopher.png'
  import gopherPink from '$lib/assets/gopher-pink.png'
  import { onMount } from 'svelte'

  let { children, data } = $props()

  let logoSrc = $state<string>(gopher)

  onMount(() => {
    const root = document.documentElement
    const setByAttr = () => {
      const isDark = root.getAttribute('data-theme') === 'dark'
      logoSrc = isDark ? gopher : gopherPink
    }
    setByAttr()
    const mo = new MutationObserver(setByAttr)
    mo.observe(root, { attributes: true, attributeFilter: ['data-theme'] })
    return () => mo.disconnect()
  })
</script>

<svelte:head>
  <link
    rel="icon"
    href={favicon}
  />
</svelte:head>

<div class="min-h-screen bg-sd-bg text-sd-fg relative gradient-container">
  <div class="sticky top-0 z-50">
    <TopBar>
      {#snippet left()}
        <Logo href="/">
          {#snippet icon()}<img
              src={logoSrc}
              alt=""
              class="h-6 w-6"
            />{/snippet}
          {#snippet text()}
            <span
              class="relative inline-block px-1 py-[0.5] bg-sd-fg rounded-sm group hover:bg-sd-accent transition-colors"
            >
              <h1
                class="prose text-4xl font-black uppercase italic tracking-tight leading-none bg-sd-bg bg-clip-text text-transparent"
              >
                Just Go!
              </h1>
            </span>
          {/snippet}
        </Logo>
      {/snippet}

      {#snippet right()}
        <a
          href="/colors"
          class="text-sm no-underline text-sd-muted hover:text-sd-accent"
          >Colors</a
        >
        <ThemeToggle />
      {/snippet}
    </TopBar>
  </div>

  <div class="relative z-10">
    {@render children()}
  </div>
</div>

<style>
  :global(.gradient-container)::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 20; /* above page content (z-10), below TopBar (z-50) */
    background: radial-gradient(
      circle at 0 0,
      rgb(from var(--color-sd-accent) r g b / 0.06),
      transparent 60%
    );
  }
</style>

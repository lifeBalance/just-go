<script lang="ts">
  import TopBar from '@components/TopBar.svelte'
  import Logo from '@components/Logo.svelte'
  import ThemeToggle from '@components/ThemeToggle.svelte'
  import { onMount } from 'svelte'
  import gopher from '@assets/gopher.png?url'
  import gopherPink from '@assets/gopher-pink.png?url'
  import { docsConfig } from '@lib/docs/config'
  const basePrefix = (docsConfig.basePath ?? import.meta.env.BASE_URL)
  const homeHref = basePrefix.endsWith('/') ? basePrefix : `${basePrefix}/`
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

<div class="sticky top-0 z-50">
  <TopBar>
    {#snippet left()}
      <Logo href={homeHref}>
        {#snippet icon()}<img src={logoSrc} alt="Just Go" class="h-6 w-6" />{/snippet}
        {#snippet text()}
          <span class="relative inline-block px-1 py-[0.5] bg-sd-fg rounded-sm group hover:bg-sd-accent transition-colors">
            <h1 class="prose text-2xl md:text-4xl font-black uppercase italic tracking-tight leading-none bg-sd-bg bg-clip-text text-transparent">
              Just Go!
            </h1>
          </span>
        {/snippet}
      </Logo>
    {/snippet}

    {#snippet right()}
      <a href={`${basePrefix}colors`} class="text-sm no-underline text-sd-muted hover:text-sd-accent">Colors</a>
      <ThemeToggle />
    {/snippet}
  </TopBar>
</div>

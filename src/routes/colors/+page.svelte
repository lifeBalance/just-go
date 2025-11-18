<script lang="ts">
  import { onMount } from 'svelte'

  const vars = ['--sd-bg', '--sd-fg', '--sd-muted', '--sd-accent', '--sd-border', '--sd-hover']
  let values: Record<string, string> = {}
  let theme = 'light'
  let okSupport = true

  function refresh() {
    const style = getComputedStyle(document.documentElement)
    const out: Record<string, string> = {}
    for (const v of vars) out[v] = style.getPropertyValue(v).trim()
    values = out
    theme = document.documentElement.getAttribute('data-theme') || 'light'
  }

  onMount(() => {
    okSupport = CSS.supports?.('color', 'oklch(50% 0.1 0)') ?? true
    refresh()
    const obs = new MutationObserver(refresh)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => obs.disconnect()
  })
</script>

<section class="text-(--sd-fg)">
  <h1 class="text-2xl mb-2">Color Tokens</h1>
  <p class="text-sm text-(--sd-muted)">Theme: {theme}</p>
  {#if !okSupport}
    <p class="text-sm text-(--sd-muted)">Your browser may not support OKLCH colors; swatches might not render. Try a recent Chromium/Safari/Firefox version.</p>
  {/if}

  <div class="mt-4" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem;">
    {#each vars as v}
      <div class="rounded-md border" style:border-color={'var(--sd-border)'}>
        <div class="h-16 rounded-t-md" style:background={`var(${v})`}></div>
        <div class="p-2 text-sm">
          <div><code>{v}</code></div>
          <div class="text-(--sd-muted)">{values[v] || ''}</div>
        </div>
      </div>
    {/each}
  </div>
</section>

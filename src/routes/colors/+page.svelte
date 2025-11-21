<script lang="ts">
  import { onMount } from 'svelte'

  const vars = [
    '--sd-bg',
    '--sd-fg',
    '--sd-muted',
    '--sd-accent',
    '--sd-border',
    '--sd-hover',
  ]
  let values: Record<string, string> = {}
  let theme = 'light'

  function refresh() {
    const style = getComputedStyle(document.documentElement)
    const out: Record<string, string> = {}
    for (const v of vars) out[v] = style.getPropertyValue(v).trim()
    values = out
    theme = document.documentElement.getAttribute('data-theme') || 'light'
  }

  onMount(() => {
    refresh()
    const obs = new MutationObserver(refresh)
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })
    return () => obs.disconnect()
  })
</script>

<section class="text-(--sd-fg) max-w-5xl mx-auto p-4">
  <h1 class="text-2xl mb-2">Color Tokens</h1>
  <p class="text-sm text-(--sd-muted)">Theme: {theme}</p>


  <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {#each vars as v}
      <div class="rounded-md border border-(--sd-border)">
        <div
          class="h-16 rounded-t-md"
          style:background={`var(${v})`}
        ></div>
        <div class="p-2 text-sm">
          <div><code>{v}</code></div>
          <div class="text-(--sd-muted)">{values[v] || ''}</div>
        </div>
      </div>
    {/each}
  </div>
</section>

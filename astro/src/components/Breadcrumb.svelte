<script lang="ts">
  export let path: string
  export let nav: {
    label: string
    items: { url: string; title: string }[]
    dir: string
  }[]

  // Make crumbs reactive to path changes
  $: crumbs = (() => {
    const segments = path.split('/').filter(Boolean)

    return segments.map((segment, index) => {
      const currentPath = '/' + segments.slice(0, index + 1).join('/')

      // Find the matching section in nav
      const section = nav.find((n) => n.dir === segment)
      if (section) {
        return section.label
      }

      // Find matching item in nav
      for (const section of nav) {
        const item = section.items.find((i) => i.url === currentPath)
        if (item) {
          return item.title
        }
      }

      // Fallback to capitalized segment
      return segment.charAt(0).toUpperCase() + segment.slice(1)
    })
  })()
</script>

<nav aria-label="Breadcrumb">
  <ol class="flex gap-2 text-xs text-sd-muted">
    {#each crumbs as crumb, i}
      <li class="flex items-center gap-2">
        {#if i > 0}
          <span>/</span>
        {/if}
        <span>{crumb}</span>
      </li>
    {/each}
  </ol>
</nav>

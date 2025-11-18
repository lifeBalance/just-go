<script lang="ts">
  import SidebarItem from './SidebarItem.svelte'
  import CollapsibleSection from './CollapsibleSection.svelte'
  export let nav: {
    label: string
    href?: string
    items: { url: string; title: string }[]
  }[]
  export let heading = 'Contents'
  export let currentPath: string = ''

  const normalize = (p: string) => (p ? p.replace(/\/$/, '') : '')
  const keyFor = (group: {
    label: string
    items: { url: string; title: string }[]
  }) => {
    const first = group.items[0]?.url ?? ''
    const parts = first.split('/').filter(Boolean)
    // e.g. /basics/variables/intro -> 'variables'
    return parts[1] ?? group.label
  }

  let open: Record<string, boolean> = {}
  let prevPath = ''

  $: if (normalize(currentPath) !== normalize(prevPath)) {
    prevPath = currentPath
    // Ensure active group is expanded; preserve others
    const activeKey = (() => {
      for (const g of nav) {
        if (g.items.some((i) => normalize(i.url) === normalize(currentPath))) {
          return keyFor(g)
        }
      }
      return ''
    })()
    const next: Record<string, boolean> = {}
    for (const g of nav) {
      const k = keyFor(g)
      next[k] = k === activeKey ? true : (open[k] ?? false)
    }
    open = next
  }

  function toggle(group: {
    label: string
    items: { url: string; title: string }[]
  }) {
    const k = keyFor(group)
    open = { ...open, [k]: !open[k] }
  }
</script>

<nav
  aria-label={heading}
  class="text-sd-fg p-4 border-r border-sd-border min-w-[25%] min-h-full"
>
  {#each nav as group}
    <CollapsibleSection
      label={group.label}
      href={group.href}
      open={open[keyFor(group)]}
      onToggle={() => toggle(group)}
    >
      <ul class="list-none p-0 m-0 pl-6">
        {#each group.items as item}
          <SidebarItem
            url={item.url}
            title={item.title}
            {currentPath}
          />
        {/each}
      </ul>
    </CollapsibleSection>
  {/each}
</nav>

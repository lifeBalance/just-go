<script lang="ts">
  import SidebarItem from './SidebarItem.svelte'
  export let nav: {
    label: string
    href?: string
    items: { url: string; title: string }[]
  }[]
  export let heading = 'Contents'
  export let currentPath: string = ''
</script>

<nav aria-label={heading} class="text-(--sd-fg)">
  <h3 class="mt-1 mb-3 text-sm text-(--sd-muted)">{heading}</h3>
  {#each nav as group}
    <section class="mb-4">
      {#if group.label}
        {#if group.href}
          <h4 class="mb-2 text-base">
            <a href={group.href} class="no-underline text-(--sd-fg) hover:text-(--sd-accent)">{group.label}</a>
          </h4>
        {:else}
          <h4 class="mb-2 text-base">{group.label}</h4>
        {/if}
      {/if}
      <ul class="list-none p-0 m-0">
        {#each group.items as item}
          <SidebarItem url={item.url} title={item.title} {currentPath} />
        {/each}
      </ul>
    </section>
  {/each}
</nav>

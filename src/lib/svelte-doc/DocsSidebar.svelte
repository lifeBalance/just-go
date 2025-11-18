<script lang="ts">
  export let nav: { label: string; href?: string; items: { url: string; title: string }[] }[]
  export let heading = 'Contents'
  export let currentPath: string = ''
  export let homeHref: string = '/'
  const normalize = (p: string) => p.replace(/\/$/, '')
  const isActive = (url: string) => normalize(currentPath) === normalize(url)
</script>

<nav aria-label={heading}>
  <a
    href={homeHref}
    aria-current={isActive(homeHref) ? 'page' : undefined}
    style="display:inline-block; margin: 0 0 .75rem; padding: .25rem .5rem; border-radius: .375rem; text-decoration: none; color: inherit; background: {isActive(homeHref) ? 'var(--muted, #f2f2f2)' : 'transparent'};"
  >Home</a>
  <h3 style="margin: 0 0 .75rem; font-size: 1rem; color: var(--acc, #666);">{heading}</h3>
  {#each nav as group}
    <section style="margin-bottom: 1rem;">
      {#if group.label}
        {#if group.href}
          <h4 style="margin: 0 0 .5rem; font-size: .95rem;">
            <a href={group.href} style="text-decoration:none; color:inherit;">{group.label}</a>
          </h4>
        {:else}
          <h4 style="margin: 0 0 .5rem; font-size: .95rem;">{group.label}</h4>
        {/if}
      {/if}
      <ul style="list-style: none; padding: 0; margin: 0;">
        {#each group.items as item}
          <li>
            <a
              href={item.url}
              aria-current={isActive(item.url) ? 'page' : undefined}
              style="display:block; padding: .25rem .5rem; border-radius: .375rem; text-decoration: none; color: inherit; background: {isActive(item.url) ? 'var(--muted, #f2f2f2)' : 'transparent'};"
            >{item.title}</a>
          </li>
        {/each}
      </ul>
    </section>
  {/each}
</nav>

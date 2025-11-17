<script lang="ts">
  export let data: { nav: { label: string; items: { url: string; title: string }[] }[] }
</script>

<div style="display:flex; gap:2rem; align-items:flex-start;">
  <aside style="min-width:240px; position:sticky; top:1rem;">
    <nav aria-label="Design Patterns">
      {#each data.nav as group}
        <section>
          <h3 style="margin:0 0 .5rem;">{group.label}</h3>
          <ul>
            {#each group.items as item}
              <li><a href={item.url}>{item.title}</a></li>
            {/each}
          </ul>
        </section>
      {/each}
    </nav>
  </aside>
  <main style="flex:1; min-width:0;">
    <slot />
  </main>
</div>

<script lang="ts">
  import DocsSidebar from '$lib/svelte-doc/DocsSidebar.svelte'
  export let data: { path: string; nav: { label: string; href?: string; items: { url: string; title: string }[] }[] }
</script>

<div style="display:flex; gap:2rem; align-items:flex-start;">
  <aside style="min-width:240px; position:sticky; top:1rem;">
    <DocsSidebar nav={data.nav} heading="Design Patterns" currentPath={data.path} />
  </aside>
  <main style="flex:1; min-width:0;">
    <slot />
  </main>
</div>

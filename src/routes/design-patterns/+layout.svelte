<script lang="ts">
  import Sidebar from '$lib/components/Sidebar.svelte'
  export let data: { nav: { label: string; href?: string; items: { url: string; title: string }[] }[] }
</script>

<div style="display:flex; gap:2rem; align-items:flex-start;">
  <aside style="min-width:240px; position:sticky; top:1rem;">
    <Sidebar nav={data.nav} heading="Design Patterns" />
  </aside>
  <main style="flex:1; min-width:0;">
    <slot />
  </main>
</div>

<script lang="ts">
  import { page } from '$app/stores'
  import { makeResolver, type MdModule } from '$lib/docs/resolver'
  const pages: Record<string, MdModule> = import.meta.glob('/src/content/basics/**/*.md', { eager: true }) as Record<string, MdModule>
  const resolve = makeResolver(pages, '/basics')
  $: seg = $page.params.page ?? ''
  $: mod = resolve(seg)
</script>

{#if mod}
  <svelte:component this={mod.default as any} />
{:else}
  <p>Not found.</p>
{/if}

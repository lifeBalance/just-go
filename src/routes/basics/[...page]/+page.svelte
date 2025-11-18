<script lang="ts">
  import { page } from '$app/stores'
  import { createSection } from '$lib/docs/section'
  const { resolver } = createSection('basics')
  const resolve = resolver()
  $: seg = $page.params.page ?? ''
  $: mod = resolve(seg)
</script>

{#if mod}
  <svelte:component this={mod.default as any} />
{:else}
  <p>Not found.</p>
{/if}

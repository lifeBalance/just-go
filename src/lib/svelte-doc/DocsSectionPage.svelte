<script lang="ts">
  import { page } from '$app/stores'
  import { createSection } from '$lib/docs/section'
  export let section: string
  export let notFound: string = 'Not found.'

  const { resolver } = createSection(section)
  const resolve = resolver()
  $: seg = $page.params.page ?? ''
  $: mod = resolve(seg)
</script>

{#if mod}
  <svelte:component this={(mod as any).default} />
{:else}
  <p>{notFound}</p>
{/if}

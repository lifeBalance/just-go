<script lang="ts">
  import { createSection } from '$lib/docs/section'
  export let section: string
  export let segment: string = ''
  export let notFound: string = 'Not found.'

  const { resolver } = createSection(section)
  const resolve = resolver()
  $: mod = resolve(segment)
</script>

{#if mod}
  <svelte:component this={(mod as any).default} />
{:else}
  <p>{notFound}</p>
{/if}

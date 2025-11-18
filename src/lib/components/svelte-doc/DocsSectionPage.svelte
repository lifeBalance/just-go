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
  <div class="prose prose-headings:uppercase prose-a:text-sd-accent prose-hr:border-sd-border prose-img:rounded-md max-w-none">
    <svelte:component this={(mod as any).default} />
  </div>
{:else}
  <p>{notFound}</p>
{/if}

<script lang="ts">
  import { page } from '$app/stores'
  type MdModule = { default: unknown }
  const pages: Record<string, MdModule> = import.meta.glob('/src/content/design-patterns/**/*.md', { eager: true }) as Record<string, MdModule>
  const toRoute = (fs: string) =>
    fs
      .replace(/^\/src\/content/, '')
      .replace(/index\.md$/, '')
      .replace(/\.md$/, '')
      .replace(/\/$/, '')
  const routeMap = new Map<string, MdModule>(Object.entries(pages).map(([fs, mod]) => [toRoute(fs), mod]))
  const normalize = (path: string) => path.replace(/\/$/, '')
  $: seg = $page.params.page ?? ''
  $: target = normalize('/design-patterns' + (seg ? '/' + seg : ''))
  $: mod = routeMap.get(target)
</script>

{#if mod}
  <svelte:component this={mod.default as any} />
{:else}
  <p>Not found.</p>
{/if}

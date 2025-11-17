<script lang="ts">
  export let data: { pageParam?: string }
  type SvxModule = { default: unknown }
  const pages: Record<string, SvxModule> = import.meta.glob('/src/content/basics/**/*.svx', { eager: true }) as Record<string, SvxModule>
  const toRoute = (fs: string) => fs.replace(/^\/src\/content/, '').replace(/index\.svx$/, '').replace(/\.svx$/, '')
  const routeMap = new Map<string, SvxModule>(Object.entries(pages).map(([fs, mod]) => [toRoute(fs), mod]))
  const target = '/basics/' + (data.pageParam ?? '')
  const mod = routeMap.get(target)
</script>

{#if mod}
  <svelte:component this={mod.default as any} />
{:else}
  <p>Not found.</p>
{/if}

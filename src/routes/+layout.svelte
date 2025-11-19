<script lang="ts">
  import '../app.css'
  import favicon from '$lib/assets/favicon.svg'
  import TopBar from '$lib/components/svelte-doc/TopBar.svelte'

  let { children, data } = $props()
</script>

<svelte:head>
  <link
    rel="icon"
    href={favicon}
  />
</svelte:head>

<div class="min-h-screen bg-sd-bg text-sd-fg flex flex-col">
  <TopBar homeHref="/" currentPath={data?.path ?? ''} />
  <div class="flex-1">
    {@render children()}
  </div>
</div>

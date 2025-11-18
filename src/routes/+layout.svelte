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

<TopBar homeHref="/" currentPath={data?.path ?? ''} />

{@render children()}

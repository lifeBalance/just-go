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

<div class="min-h-screen bg-sd-bg text-sd-fg relative gradient-container">
  <TopBar homeHref="/" currentPath={data?.path ?? ''} />
  <div class="relative z-10">
    {@render children()}
  </div>
</div>

<style>
  :global(.gradient-container)::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 45vw;
    height: 45vh;
    pointer-events: none;
    z-index: 20; /* above page content (z-10), below TopBar (z-50) */
    background: radial-gradient(
      circle at 0 0,
      rgb(from var(--color-sd-accent) r g b / 0.06),
      transparent 60%
    );
  }
</style>

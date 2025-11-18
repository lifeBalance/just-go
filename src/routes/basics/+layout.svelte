<script lang="ts">
  import DocsSidebar from '$lib/components/svelte-doc/DocsSidebar.svelte'
  export let data: {
    path: string
    nav: {
      label: string
      href?: string
      items: { url: string; title: string }[]
    }[]
  }
</script>

<div class="mx-auto min-h-screen bg-amber-400">
  <div class="flex items-stretch">
    <aside class="sticky top-0 h-screen overflow-y-auto w-64 shrink-0 bg-sd-hover">
      <DocsSidebar
        nav={data.nav}
        heading="Basics"
        currentPath={data.path}
      />
    </aside>
    <main class="min-w-0 flex-1 bg-sd-bg p-6">
      <slot />
    </main>
  </div>
</div>

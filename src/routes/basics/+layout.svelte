<script lang="ts">
  import Breadcrumb from '$lib/components/svelte-doc/Breadcrumb.svelte'
  import DocsSidebar from '$lib/components/svelte-doc/DocsSidebar.svelte'
  export let data: {
    path: string
    nav: {
      label: string
      href?: string
      items: { url: string; title: string }[]
      dir: string
    }[]
  }
  console.log(data)
</script>

<div class="mx-auto min-h-screen bg-amber-400">
  <div class="flex items-stretch">
    <aside
      class="sticky top-0 h-screen overflow-y-auto w-64 shrink-0 bg-sd-hover"
    >
      <DocsSidebar
        nav={data.nav}
        heading="Basics"
        currentPath={data.path}
      />
    </aside>
    <main class="min-w-0 flex-1 bg-sd-bg p-6">
      <Breadcrumb
        path={data.path}
        nav={data.nav}
      />
      <slot />
    </main>
  </div>
</div>

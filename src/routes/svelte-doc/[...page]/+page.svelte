<script lang="ts">
  import Breadcrumb from '$lib/components/svelte-doc/Breadcrumb.svelte'
  import DocsSidebar from '$lib/components/svelte-doc/DocsSidebar.svelte'
  import DocsToc from '$lib/components/svelte-doc/DocsToc.svelte'
  import DocsSectionPage from '$lib/components/svelte-doc/DocsSectionPage.svelte'

  export let data: {
    segment: string
    path: string
    nav: { label: string; href?: string; items: { url: string; title: string }[]; dir: string }[]
  }
</script>

<div class="flex h-[calc(100vh-var(--topbar-height))]">
  <aside class="sticky top-0 h-full overflow-y-auto w-64 shrink-0 bg-sd-hover">
    <DocsSidebar nav={data.nav} heading="Svelte Doc" currentPath={data.path} />
  </aside>
  <main class="min-w-0 flex-1 bg-sd-bg p-6 overflow-y-auto">
    <div class="pb-4">
      <Breadcrumb path={data.path} nav={data.nav} />
    </div>
    <div id="content">
      <DocsSectionPage section="svelte-doc" segment={data.segment} />
    </div>
  </main>
  <aside class="hidden xl:block sticky top-0 h-full overflow-y-auto w-64 shrink-0 bg-sd-hover p-3 border-l border-sd-border">
    <DocsToc />
  </aside>
</div>

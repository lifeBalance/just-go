<script lang="ts">
  import Breadcrumb from '$lib/components/svelte-doc/Breadcrumb.svelte'
  import DocsSidebar from '$lib/components/svelte-doc/DocsSidebar.svelte'
  import DocsToc from '$lib/components/svelte-doc/DocsToc.svelte'
  import DocsSectionPage from '$lib/components/svelte-doc/DocsSectionPage.svelte'
  import PageBtn from '$lib/components/svelte-doc/PageBtn.svelte'

  type NavGroup = {
    label: string
    href?: string
    items: { url: string; title: string }[]
    dir: string
  }
  type FlatNavItem = { url: string; title: string }
  let { data } = $props<{
    section: string
    segment: string
    path: string
    nav: NavGroup[]
    prev?: FlatNavItem
    next?: FlatNavItem
  }>()

  // Adjust this to match your actual TopBar height
  const topBarHeight = '4rem'
</script>

<div class="flex max-w-screen-2xl mx-auto">
  <!-- Left Sidebar - TOC -->
  <aside
    class="sticky self-start overflow-y-auto w-64 shrink-0 border-r border-sd-border"
    style="top: {topBarHeight}; height: calc(100vh - {topBarHeight});"
  >
    <div class="p-4">
      <DocsSidebar
        nav={data.nav}
        heading=""
        currentPath={data.path}
      />
    </div>
  </aside>

  <!-- Main Content - Scrolls naturally -->
  <main class="min-w-0 flex-1 bg-sd-bg px-10 py-8">
    <div class="max-w-4xl mx-auto">
      <div class="pb-4">
        <Breadcrumb
          path={data.path}
          nav={data.nav}
        />
      </div>
      <div id="content">
        <DocsSectionPage
          section={data.section}
          segment={data.segment}
        />
      </div>
      <div class="mt-8 flex items-center justify-between">
        {#if data.prev}
          <PageBtn
            href={data.prev.url}
            label={data.prev.title}
            direction="prev"
          />
        {/if}
        <span class="flex-1"></span>
        {#if data.next}
          <PageBtn
            href={data.next.url}
            label={data.next.title}
            direction="next"
          />
        {/if}
      </div>
    </div>
  </main>

  <!-- Right Sidebar - On This Page -->
  <aside
    class="hidden xl:block sticky self-start overflow-y-auto w-64 shrink-0 border-l border-sd-border"
    style="top: {topBarHeight}; height: calc(100vh - {topBarHeight});"
  >
    <div class="p-4">
      <DocsToc />
    </div>
  </aside>
</div>

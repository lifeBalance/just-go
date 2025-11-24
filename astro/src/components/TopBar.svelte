<script
  module
  lang="ts"
>
  import type { Snippet } from 'svelte'
  export type Props = {
    left?: Snippet
    right?: Snippet
  }
</script>

<script lang="ts">
  let { left, right } = $props()
</script>

<nav class="z-50 bg-sd-bg text-sd-fg border-b border-sd-border">
  <div class="site-container flex items-center justify-between px-4 py-2 h-(--topbar-height)">
    <div class="flex items-center gap-3">
      {@render left?.()}
    </div>
    <div class="flex items-center gap-3">
      {@render right?.()}
    </div>
  </div>
</nav>

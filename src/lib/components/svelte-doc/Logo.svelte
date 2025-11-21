<script module lang="ts">
  import type { Snippet } from 'svelte'
  export type Props = {
    href?: string
    icon?: Snippet
    text?: Snippet
  }
</script>

<script lang="ts">
  let { href = '/', icon, text } = $props()
</script>

<a
  href={href}
  class="inline-flex items-center gap-2 px-2 py-1 rounded-md no-underline text-(--sd-fg) hover:bg-(--sd-hover)"
>
  <span aria-hidden="true">{@render icon?.()}</span>
  <span>{@render text?.()}</span>
</a>

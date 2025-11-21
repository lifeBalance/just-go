<script module lang="ts">
  import type { Snippet } from 'svelte'
  export type Props = {
    href?: string
    rel?: string
    target?: string
    ariaLabel?: string
    class?: string
    children?: Snippet
  }
</script>

<script lang="ts">
  let { href = '#', rel = undefined, target = undefined, ariaLabel = undefined, class: className = '', children } = $props()
</script>

<a
  href={href}
  rel={rel}
  target={target}
  class={`block rounded-lg border border-sd-border bg-sd-hover px-5 py-4 text-sd-fg no-underline hover:bg-sd-hover/80 hover:border-sd-accent transition ${className}`}
  aria-label={ariaLabel}
>
  {@render children?.()}
</a>

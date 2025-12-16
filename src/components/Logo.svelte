<script module lang="ts">
  import type { Snippet } from 'svelte'
  export type Props = {
    href?: string
    icon?: Snippet
    text?: Snippet
  }
</script>

<script lang="ts">
  import { docsConfig } from '@lib/docs/config'
  const base = docsConfig.basePath ?? import.meta.env.BASE_URL
  const defaultHref = base.endsWith('/') ? base : base + '/'
  let { href = defaultHref, icon, text } = $props()
</script>

<a
  href={href}
  class="inline-flex items-center gap-3"
>
  <span aria-hidden="true">{@render icon?.()}</span>
  <span>{@render text?.()}</span>
</a>

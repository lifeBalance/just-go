<script module lang="ts">
  import type { Snippet } from 'svelte'
  export type Props = {
    left?: Snippet
    right?: Snippet
    kind?: 'solid' | 'glass' | 'transparent'
    position?: 'sticky' | 'fixed' | 'static'
    inset?: boolean
    elevation?: 'none' | 'sm' | 'md' | 'lg'
    border?: boolean
  }
</script>

<script lang="ts">
  import { cn } from '$lib'
  import { cva, type VariantProps } from 'class-variance-authority'

  const topbar = cva(
    'z-50 flex items-center justify-between px-4 py-2 h-(--topbar-height)',
    {
      variants: {
        kind: {
          solid: 'bg-sd-bg text-sd-fg',
          glass:
            'text-sd-fg backdrop-blur-md bg-[oklch(from_var(--color-sd-bg)_l_c_h_/_0.7)] supports-[backdrop-filter]:bg-[oklch(from_var(--color-sd-bg)_l_c_h_/_0.6)]',
          transparent: 'bg-transparent text-sd-fg',
        },
        position: {
          sticky: 'sticky top-0',
          fixed: 'fixed top-0 left-0 right-0',
          static: 'static',
        },
        inset: {
          true: 'rounded-xl ring-1 ring-sd-border/50',
          false: '',
        },
        elevation: {
          none: '',
          sm: 'shadow-sm',
          md: 'shadow-md',
          lg: 'shadow-lg',
        },
        border: {
          true: 'border-b border-sd-border',
          false: '',
        },
      },
      defaultVariants: {
        kind: 'solid',
        position: 'sticky',
        inset: false,
        elevation: 'none',
        border: true,
      },
    },
  )

  type TopBarVariants = VariantProps<typeof topbar>
  let {
    kind = 'solid',
    position = 'sticky',
    inset = false,
    elevation = 'none',
    border = true,
    left,
    right,
  } = $props<{
    kind?: TopBarVariants['kind']
    position?: TopBarVariants['position']
    inset?: boolean
    elevation?: TopBarVariants['elevation']
    border?: TopBarVariants['border']
    left?: import('svelte').Snippet
    right?: import('svelte').Snippet
  }>()
</script>

<nav class={cn(topbar({ kind, position, inset, elevation, border }))}>
  <div class="flex items-center gap-3">
    {@render left?.()}
  </div>
  <div class="flex items-center gap-3">
    {@render right?.()}
  </div>
</nav>

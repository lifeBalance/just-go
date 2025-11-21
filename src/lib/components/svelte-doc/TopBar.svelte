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
  export let kind: TopBarVariants['kind'] = 'solid'
  export let position: TopBarVariants['position'] = 'sticky'
  export let inset: boolean = false
  export let elevation: TopBarVariants['elevation'] = 'none'
  export let border: TopBarVariants['border'] = true
</script>

<nav class={cn(topbar({ kind, position, inset, elevation, border }))}>
  <div class="flex items-center gap-3">
    <slot name="left" />
  </div>
  <div class="flex items-center gap-3">
    <slot name="right" />
  </div>
</nav>

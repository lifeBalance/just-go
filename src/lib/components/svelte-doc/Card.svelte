<script lang="ts" context="module">
  import { cva, type VariantProps } from 'class-variance-authority'
  export const cardVariants = cva(
    'block rounded-lg border border-(--sd-border) p-5 no-underline text-(--sd-fg) hover:bg-(--sd-hover) transition',
    {
      variants: {
        tone: {
          default: '',
          accent: 'border-(--sd-accent)',
        },
      },
      defaultVariants: {
        tone: 'default',
      },
    },
  )
  export type CardVariantProps = VariantProps<typeof cardVariants>
</script>

<script lang="ts">
  import { cn } from '$lib/utils/cn'
  export let href: string = '#'
  export let title: string
  export let description: string = ''
  export let tone: CardVariantProps['tone'] = 'default'
  export let className: string = ''
  $: classes = cn(cardVariants({ tone }), className)
</script>

<a href={href} class={classes}>
  <h2 class="text-xl font-medium">{title}</h2>
  {#if description}
    <p class="text-sm text-(--sd-muted)">{description}</p>
  {/if}
</a>

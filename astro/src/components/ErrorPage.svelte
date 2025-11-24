<script lang="ts" context="module">
  import { cva, type VariantProps } from 'class-variance-authority'

  export const containerVariants = cva('mx-auto max-w-3xl p-6')

  export const titleVariants = cva('text-3xl font-semibold mb-2', {
    variants: {
      tone: {
        default: 'text-(--sd-fg)',
        subtle: 'text-(--sd-muted)',
      },
    },
    defaultVariants: { tone: 'default' },
  })

  export const textVariants = cva('mb-6', {
    variants: {
      tone: {
        default: 'text-(--sd-muted)',
        strong: 'text-(--sd-fg)',
      },
    },
    defaultVariants: { tone: 'default' },
  })

  export const linkVariants = cva(
    'inline-flex items-center gap-2 px-3 py-2 rounded-md no-underline transition border',
    {
      variants: {
        tone: {
          default:
            'text-(--sd-fg) hover:bg-(--sd-hover) border-(--sd-border)',
          accent:
            'text-(--sd-fg) hover:bg-(--sd-hover) border-(--sd-accent)',
        },
      },
      defaultVariants: { tone: 'default' },
    },
  )

  export type LinkVariantProps = VariantProps<typeof linkVariants>
</script>

<script lang="ts">
  const cn = (...classes: Array<string | undefined | null | false>) => classes.filter(Boolean).join(' ')
  export let title: string
  export let message: string
  export let status: number | undefined = undefined
  export let homeHref: string = '/'
  export let className: string = ''
  export let tone: VariantProps<typeof titleVariants>['tone'] = 'default'
</script>

<section class={cn(containerVariants(), className)}>
  <h1 class={titleVariants({ tone })}>{title}</h1>
  <p class={textVariants({ tone: 'default' })}>{message}</p>

  <a href={homeHref} class={linkVariants({ tone: 'default' })}>🏠 Back Home</a>

  {#if status !== undefined}
    <div class="mt-8 text-xs text-(--sd-muted)">Status: {status}</div>
  {/if}
</section>

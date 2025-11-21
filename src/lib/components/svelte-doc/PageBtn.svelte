<script lang="ts">
  import Icon from '@iconify/svelte'
  import Card from './Card.svelte'
  const p = $props<{
    href: string
    label: string
    direction: 'prev' | 'next'
  }>()
  const isPrev = $derived(p.direction === 'prev')
  const cardClass = $derived(
    `inline-flex items-center gap-2 w-[45%] ${isPrev ? '' : 'justify-end text-right'}`,
  )
</script>

<Card
  href={p.href}
  rel={p.direction}
  target="_self"
  class={cardClass}
  ariaLabel={(isPrev ? 'Previous: ' : 'Next: ') + p.label}
>
  {#snippet children()}
    {#if isPrev}
      <Icon icon="mdi:chevron-left" class="text-sd-muted text-3xl" />
      <div>
        <p class="text-sd-muted">Previous</p>
        <p class="text-xl">{p.label}</p>
      </div>
    {:else}
      <div>
        <p class="text-sd-muted">Next</p>
        <p class="text-xl">{p.label}</p>
      </div>
      <Icon icon="mdi:chevron-right" class="text-sd-muted text-3xl" />
    {/if}
  {/snippet}
</Card>

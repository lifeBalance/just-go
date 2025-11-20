<script lang="ts">
  import Icon from '@iconify/svelte'
  const p = $props<{
    href: string
    label: string
    direction: 'prev' | 'next'
  }>()
  const isPrev = $derived(p.direction === 'prev')
  const btnClass = $derived(
    `inline-flex items-center gap-2 px-6 py-4 border border-sd-border rounded-sm no-underline text-sd-fg hover:bg-sd-hover transition w-[45%] ${
      isPrev ? '' : 'justify-end text-right'
    }`,
  )
</script>

<a
  href={p.href}
  rel={p.direction}
  class={btnClass}
  aria-label={(isPrev ? 'Previous: ' : 'Next: ') + p.label}
>
  {#if isPrev}
    <Icon
      icon="mdi:chevron-left"
      class="text-sd-muted text-3xl"
    />
    <div class="">
      <p class="text-sd-muted">Previous</p>
      <p class="text-xl">{p.label}</p>
    </div>
  {:else}
    <div class="">
      <p class="text-sd-muted">Next</p>
      <p class="text-xl">{p.label}</p>
    </div>
    <Icon
      icon="mdi:chevron-right"
      class="text-sd-muted text-3xl"
    />
  {/if}
</a>

<script lang="ts">
  import Icon from '@iconify/svelte'
  import type { Snippet } from 'svelte'
  const p = $props<{
    label: string
    href?: string
    open: boolean
    active?: boolean
    onToggle?: () => void
    children?: Snippet
  }>()
  function onHeaderClick() {
    p.onToggle?.()
  }
</script>

<section class="mb-2">
  {#if p.label}
    <button
      type="button"
      class="w-full flex items-center justify-between px-2 py-1 cursor-pointer"
      aria-expanded={p.open}
      onclick={onHeaderClick}
    >
      <span
        class="text-sm uppercase font-bold"
        class:text-sd-accent={p.active}
        class:text-sd-muted={!p.active}>{p.label}</span
      >
      <Icon
        icon={p.open ? 'mdi:chevron-down' : 'mdi:chevron-right'}
        class="text-sd-muted"
      />
    </button>
  {/if}
  {#if p.open}
    {@render p.children?.()}
  {/if}
</section>

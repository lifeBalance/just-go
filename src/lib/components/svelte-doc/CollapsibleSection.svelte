<script lang="ts">
  import Icon from '@iconify/svelte'
  import type { Snippet } from 'svelte'
  const p = $props<{ label: string; href?: string; open: boolean; onToggle?: () => void; children?: Snippet }>()
  function onHeaderClick() {
    p.onToggle?.()
  }
</script>

<section class="mb-4">
  {#if p.label}
    <button
      type="button"
      class="w-full mb-2 flex items-center justify-between px-2 py-1 cursor-pointer"
      aria-expanded={p.open}
      onclick={onHeaderClick}
    >
      <span class="text-sm uppercase tracking-wide text-sd-muted">{p.label}</span>
      <Icon icon={p.open ? 'mdi:chevron-down' : 'mdi:chevron-right'} class="text-sd-muted" />
    </button>
  {/if}
  {#if p.open}
    {@render p.children?.()}
  {/if}
</section>

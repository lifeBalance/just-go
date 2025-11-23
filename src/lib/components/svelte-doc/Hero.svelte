<script lang="ts">
  export let as: keyof HTMLElementTagNameMap = 'h1'
  export let rotate: string = '0deg'
  import partyGopher from '$lib/assets/gopher-shaking.gif'
</script>

<svelte:element
  this={as}
  class="text-[clamp(2.5rem,10vw,8rem)] font-black uppercase tracking-tight leading-[0.85] text-sd-fg hero-shadow inline-block"
  style="transform: rotate({rotate});"
>
  <span class="block">Let's</span>
  <span class="flex justify-between relative">
    <span class="mr-2">get</span>
    <img
      src={partyGopher}
      alt="Just Go Logo"
      class="w-16 h-16 mr-4 absolute -right-8 -bottom-3"
    />
  </span>
  <span class="block">cracking!</span>
</svelte:element>

<style>
  .hero-shadow {
    text-shadow:
      0.03em 0.03em 0 var(--color-sd-border),
      0.05em 0.05em 0 var(--color-sd-accent);
  }
</style>

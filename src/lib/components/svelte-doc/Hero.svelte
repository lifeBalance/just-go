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
  <p>Let's</p>
  <p>get</p>
  <span>
    <span>cracking</span>
    <span class="relative inline-block">
      !
      <img
        src={partyGopher}
        alt="Just Go Logo"
        class="w-16 absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[65%]"
      />
    </span>
  </span>
</svelte:element>

<style>
  .hero-shadow {
    text-shadow:
      0.03em 0.03em 0 var(--color-sd-border),
      0.05em 0.05em 0 var(--color-sd-accent);
  }
</style>
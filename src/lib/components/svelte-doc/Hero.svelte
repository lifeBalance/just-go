<script lang="ts">
  export let lines: string[] = ["Let's", 'get', 'cracking!']
  export let as: keyof HTMLElementTagNameMap = 'h1'
</script>

<svelte:element
  this={as}
  class="text-[clamp(2.5rem,10vw,8rem)] font-black uppercase tracking-tight leading-[0.85] text-sd-fg hero-shadow"
>
  {#each lines as line}
    <span class="block">{line}</span>
  {/each}
</svelte:element>

<style>
  .hero-shadow {
    text-shadow:
      0.05em 0.05em 0 var(--color-sd-border),
      0.1em 0.1em 0 var(--color-sd-accent);
  }
</style>

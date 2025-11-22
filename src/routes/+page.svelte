<script lang="ts">
  import Card from '$lib/components/svelte-doc/Card.svelte'
  import partyGopher from '$lib/assets/party-gopher.gif'
  import dancingGopher from '$lib/assets/dancing-gopher.gif'
  import Hero from '$lib/components/svelte-doc/Hero.svelte'
</script>

<section class="mx-auto max-w-5xl p-6">
  <div class="flex justify-center items-center mb-20">
    <Hero />
  </div>
  <div class="flex justify-around items-center">
    <img
      src={dancingGopher}
      alt="Just Go Logo"
      class="w-16 h-16 mr-4"
    />
    <img
      src={partyGopher}
      alt="Just Go Logo"
      class="w-16 h-16 mr-4"
    />
  </div>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
    <Card href="/basics">
      {#snippet children()}
        <h2 class="text-xl font-semibold">Basics</h2>
        <p class="text-sm text-sd-muted">
          Start with the language fundamentals.
        </p>
      {/snippet}
    </Card>
    <Card href="/svelte-doc">
      {#snippet children()}
        <h2 class="text-xl font-semibold">Svelte‑Doc</h2>
        <p class="text-sm text-sd-muted">
          Build doc sites with SvelteKit helpers.
        </p>
      {/snippet}
    </Card>
  </div>
</section>

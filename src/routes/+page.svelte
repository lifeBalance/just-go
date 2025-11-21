<script lang="ts">
  import Card from '$lib/components/svelte-doc/Card.svelte'
  import partyGopher from '/src/assets/party-gopher.gif'
  import dancingGopher from '/src/assets/dancing-gopher.gif'
</script>

<section class="mx-auto max-w-5xl p-6">
  <div class="flex justify-center items-center">
    <img src={dancingGopher} alt="Just Go Logo" class="w-16 h-16 mr-4" />
    <h1 class="text-3xl font-semibold">Let's get cracking!</h1>
    <img src={partyGopher} alt="Just Go Logo" class="w-16 h-16 mr-4" />
  </div>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
    <Card href="/basics" title="Basics" description="Start with the language fundamentals." />
    <Card href="/svelte-doc" title="Svelte‑Doc" description="Build doc sites with SvelteKit helpers." />
  </div>
</section>

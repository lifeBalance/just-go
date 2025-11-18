<script lang="ts">
  import DocsSectionPage from '$lib/components/svelte-doc/DocsSectionPage.svelte'
  export let data: { segment?: string }
</script>

<DocsSectionPage section="svelte-doc" segment={data.segment ?? ''} />

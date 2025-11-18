<script lang="ts">
  export let initial = 0
  let count = initial
  const inc = () => (count += 1)
  const dec = () => (count -= 1)
  const reset = () => (count = 0)
</script>

<div
  style="display:inline-flex; flex-direction:column; gap:.5rem; align-items:flex-start;"
>
  <div>Count: {count}</div>
  <div style="display:flex; gap:.5rem;">
    <button
      type="button"
      on:click={dec}
      aria-label="Decrement"
      style="padding:.25rem .5rem;">-</button
    >
    <button
      type="button"
      on:click={inc}
      aria-label="Increment"
      style="padding:.25rem .5rem;">+</button
    >
    <button
      type="button"
      on:click={reset}
      aria-label="Reset"
      style="padding:.25rem .5rem;">Reset</button
    >
  </div>
</div>

<script lang="ts">
  export let href: string = '/'
  export let label: string = 'Home'
  export let emoji: string = '🏠'
  export let currentPath: string = ''
  const normalize = (p: string) => p.replace(/\/$/, '')
  $: active = normalize(currentPath) === normalize(href)
</script>

<a
  href={href}
  aria-current={active ? 'page' : undefined}
  class="inline-flex items-center gap-2 px-2 py-1 rounded-md no-underline text-(--sd-fg) hover:bg-(--sd-hover)"
  class:bg-(--sd-hover)={active}
  class:font-medium={active}
>
  <span aria-hidden="true">{emoji}</span>
  <span>{label}</span>
</a>

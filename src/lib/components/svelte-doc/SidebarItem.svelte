<script lang="ts">
  export let url: string
  export let title: string
  export let currentPath: string = ''
  const normalize = (p: string) => p.replace(/\/$/, '')
  $: active = normalize(currentPath) === normalize(url)
</script>

<li>
  <a
    href={url}
    aria-current={active ? 'page' : undefined}
    class="block px-2 py-1 rounded-md no-underline text-(--sd-fg) hover:bg-(--sd-hover)"
    class:bg-(--sd-hover)={active}
    class:font-medium={active}
  >{title}</a>
</li>

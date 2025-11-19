<script lang="ts">
  export let url: string
  export let title: string
  export let currentPath: string = ''
  const normalize = (p: string) => p.replace(/\/$/, '')
  $: active = normalize(currentPath) === normalize(url)
</script>

<li class="prose">
  <a
    href={url}
    aria-current={active ? 'page' : undefined}
    class="block px-2 py-1 no-underline transition-colors hover:bg-sd-border rounded-sm text-sm font-light prose"
    class:bg-sd-border={active}
    class:font-medium={active}
    class:text-sd-fg={active}
    class:text-sd-muted={!active}
    >{title}
  </a>
</li>

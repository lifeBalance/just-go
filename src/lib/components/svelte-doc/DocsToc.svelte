<script lang="ts">
  import { onMount } from 'svelte'

  type Heading = { id: string; text: string; level: number }
  const p = $props<{
    rootSelector?: string
    minLevel?: number
    maxLevel?: number
  }>()

  let items = $state<Heading[]>([])
  let activeId = $state('')

  function slugify(s: string) {
    return s
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
  }

  function build() {
    const root = document.querySelector(
      p.rootSelector ?? '#content',
    ) as HTMLElement | null
    if (!root) {
      items = []
      return undefined
    }
    const nodes = Array.from(
      root.querySelectorAll('h1,h2,h3,h4,h5,h6'),
    ) as HTMLElement[]
    const min = p.minLevel ?? 1
    const max = p.maxLevel ?? 3
    const acc: Heading[] = []
    for (const el of nodes) {
      const level = Number(el.tagName.slice(1))
      if (level < min || level > max) continue
      let id = el.id
      if (!id) {
        const base = slugify(el.textContent ?? '')
        if (!base) continue
        let unique = base
        let i = 1
        while (root.querySelector(`#${CSS.escape(unique)}`)) {
          unique = `${base}-${i++}`
        }
        el.id = unique
        id = unique
      }
      acc.push({ id, text: (el.textContent ?? '').trim(), level })
    }
    items = acc

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement
            activeId = el.id
          }
        }
      },
      { root: null, rootMargin: '0px 0px -70% 0px', threshold: 0.1 },
    )
    for (const el of nodes) io.observe(el)
    return () => io.disconnect()
  }

  onMount(() => {
    const cleanup = build()
    const mo = new MutationObserver(() => build())
    mo.observe(document.documentElement, { subtree: true, childList: true })
    return () => {
      cleanup?.()
      mo.disconnect()
    }
  })

  function getIndentClass(level: number): string {
    const indents: Record<number, string> = {
      1: 'pl-0',
      2: 'pl-2',
      3: 'pl-4',
      4: 'pl-6',
      5: 'pl-8',
      6: 'pl-10',
    }
    return indents[level] ?? 'pl-0'
  }
</script>

<nav aria-label="On this page">
  <h3 class="mb-2 text-sm uppercase font-bold text-sd-muted">On this page</h3>
  <ul class="list-none p-0 m-0">
    {#each items as h (h.id)}
      <li class="{getIndentClass(h.level)} text-sm font-light text-sd-muted">
        <a
          href={'#' + h.id}
          aria-current={activeId === h.id ? 'page' : undefined}
          class="block py-1 no-underline transition-colors {activeId !== h.id &&
            'hover:text-sd-fg'}"
          class:text-sd-accent={activeId === h.id}
          class:font-medium={activeId === h.id}
        >
          {h.text}
        </a>
      </li>
    {/each}
  </ul>
</nav>

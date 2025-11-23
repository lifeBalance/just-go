<script lang="ts">
  import { browser } from '$app/environment'
  import { expressiveCodeThemeNames, expressiveCodeOptions } from '$lib/expressive-code.config.js'

  type Props = {
    code: string
    language?: string
    title?: string
    frame?: 'auto' | 'code' | 'terminal' | 'none'
    meta?: string
    className?: string
  }
  const p = $props() as Props
  let { code, language = 'go', title, frame = 'auto', meta = '', className = '' } = p

  async function render(): Promise<string> {
    const [{ ExpressiveCode, ExpressiveCodeTheme, loadShikiTheme }, { toHtml }] = await Promise.all([
      import('expressive-code'),
      import('expressive-code/hast'),
    ])

    const themes = await Promise.all(
      expressiveCodeThemeNames.map(async (name) => new ExpressiveCodeTheme(await (loadShikiTheme as any)(name))),
    )
    const ec = new ExpressiveCode({ themes, frames: expressiveCodeOptions.frames })

    const metaParts: string[] = []
    if (title) metaParts.push(`title="${title.replace(/"/g, '&quot;')}"`)
    if (frame && frame !== 'auto') metaParts.push(`frame="${frame}"`)
    if (meta) metaParts.push(meta)
    const metaStr = metaParts.join(' ')

    const { renderedGroupAst, styles } = await ec.render({ code, language, meta: metaStr })
    const baseStyles = await ec.getBaseStyles()
    const themeStyles = await ec.getThemeStyles()
    const styleTags = [baseStyles, themeStyles, ...styles]
      .filter(Boolean)
      .map((css: string) => `<style>${css}</style>`)
      .join('')

    return styleTags + toHtml(renderedGroupAst)
  }
</script>

{#await render()}
  <div class={className}>
    <pre class="bg-sd-hover p-4 rounded overflow-x-auto"><code>{code}</code></pre>
  </div>
{:then html}
  <div class={className}>{@html html}</div>
{/await}
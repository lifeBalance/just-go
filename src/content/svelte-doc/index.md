---
title: Svelte‑Doc
---

# Svelte‑Doc

A tiny docs SSG for SvelteKit built from simple building blocks in `src/lib/docs` and two UI components in `src/lib/svelte-doc`.

- No custom loader magic — plain `import.meta.glob` + SvelteKit
- Markdown compiled by mdsvex (already configured)
- Per‑section navigation from `_sidebar.json`
- Clickable section headings render each folder’s `index.md`

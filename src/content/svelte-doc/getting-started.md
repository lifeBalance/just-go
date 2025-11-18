---
title: Getting Started
---

# Getting Started

- Add your Markdown files under `src/content/<section>/...`
- Create a section route folder: `src/routes/<section>/`
- Use `createSection('<section>')` in `+layout.server.ts` to build the sidebar nav
- Render pages with `<DocsSectionPage section="<section>" />` in `[...page]/+page.svelte`

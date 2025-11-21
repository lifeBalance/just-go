---
title: Folder Structure
---

# Folder Structure

- Content: `src/content/<section>/**/*.md`
  - Use `index.md` in any folder to title the group and render the section landing
  - `_toc.ts` at the section root defines order
- Logic: `src/lib/docs/*` (pure helpers)
- UI: `src/lib/svelte-doc/*` (Sidebar, SectionPage)
- Routes: `src/routes/<section>/` (tiny glue files)

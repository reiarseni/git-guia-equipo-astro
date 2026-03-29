# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server at http://localhost:4321
npm run build      # Build static site to dist/
npm run preview    # Preview production build locally
npx astro check    # TypeScript type checking (no separate lint command)
```

There are no tests in this project.

## Architecture

This is a static Astro 6 documentation site deployed to GitHub Pages at `https://reiarseni.github.io/git-guia-equipo-astro/`. The `base` path in `astro.config.mjs` must be included in all internal links.

### Navigation data flow

All navigation is driven by `src/data/sections.ts`, which exports `sections` (flat list) and `groups` (sections grouped into 5 categories). Both `Sidebar.astro` and the homepage TOC consume this data. **When adding a new page, register it here first.**

### Page structure

Each page in `src/pages/` uses `Layout.astro` as its wrapper. The layout handles:
- Mobile topbar with hamburger toggle (JavaScript inline in layout)
- Fixed sidebar on desktop (≥1024px), drawer on mobile
- Active link highlighting via `Astro.url.pathname`

Page content typically follows this pattern:
```astro
<Layout title="..." subtitle="..." badges={[...]}>
  <Section title="...">...</Section>
  <PageNav prev={{...}} next={{...}} />
</Layout>
```

### Styling

All styles live in `src/styles/global.css` (single file, ~737 lines). Design tokens are CSS variables defined at `:root`. Dark theme only. Font stack: Syne (headings), JetBrains Mono (code/labels), Inter (body).

Key variables: `--bg`, `--accent` (purple `#7c6af7`), `--accent2` (teal), `--accent3` (gold), `--sidebar-w: 264px`.

### Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`, which runs `npm ci && npm run build` on Node 22 and deploys `dist/` to GitHub Pages. No staging environment.

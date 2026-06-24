# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Newt Interactive (newtinteractive.com) — a Next.js **Pages Router** site of
interactive, educational STEM explainers. The flagship work-in-progress is the
**hemoglobin essay** (`pages/essays/hemoglobin/index.mdx`), an MDX article whose
figures are live 3D molecular viewers and animated charts.

## Commands

```bash
npm run dev      # dev server at http://localhost:3000
npm run build    # production build — note the required --webpack flag (see Gotchas)
npm run start    # serve the production build
```

There is **no lint or test script and no test suite** — don't assume `npm test`
exists. TypeScript is not a build gate either: `next.config.js` sets
`ignoreBuildErrors: true`, so type errors won't fail the build (run `npx tsc
--noEmit` manually if you want to typecheck).

## Content model

Content is organized by *kind*, each rendered differently:

- **Essays** (`pages/essays/<slug>/index.mdx`) — MDX prose. This is the primary
  format. See the MDX essay pattern below.
- **Blocks** (`pages/blocks/<slug>/index.tsx`) — standalone interactive pages,
  hand-written `.tsx` (DNA, Kalman filters, Erdős–Rényi graph, robot
  localization, etc.).
- **Series** (`pages/series/...`) and **Notes** (`pages/notes/...`) — multi-part
  collections and learning notes (e.g. Three.js Journey).

The homepage (`pages/index.tsx`) is a hand-maintained catalog of these.

### The MDX essay pattern

`@next/mdx` (wired in `next.config.js`, with `pageExtensions` including `mdx`)
lets an `index.mdx` file *be* a page. The convention, exemplified by the
hemoglobin essay:

1. The MDX imports an `export const metadata = {...}` object (title, subtitle,
   description/keywords, ogImage, url, `published`/`updated`, optional `series`).
2. It imports every figure component from an **`interactives/` barrel**, never by
   deep path — e.g. `import { MorphFigure, BohrFigure, Term } from
   "../../../interactives/essays/hemoglobin"`.
3. The file ends with a default export that wraps `children` in `MdxLayout`:
   ```jsx
   export default function MDXPage({ children }) {
     return <MdxLayout metadata={metadata}>{children}</MdxLayout>;
   }
   ```
   `MdxLayout` (`components/MdxLayout`) renders all the `<Head>`/OG/Twitter meta,
   the `Navbar`, the `ArticleHeader` (title/subtitle/date), and the
   `ArticleContainer`.
4. `mdx-components.tsx` maps raw markdown elements to house components — notably
   `### → H2`, `#### → H3`, `p → Paragraph`, `blockquote → Quote`, links → Next
   `Link`. So heading **levels in MDX are shifted** (write `###` to get the
   styled H2). Inline JSX components (`<TippyTooltip>` footnotes, `<Term>`) are
   used directly in the prose.

### `interactives/` is the public surface, prose imports stay stable

Heavy interactive components live in `interactives/<kind>/<slug>/`, **not** in
`components/`. Each slug exposes a barrel `index.ts` that is the *only* thing the
MDX imports — so internal file layout can be refactored freely without touching
prose. `components/` (with its own `components/index.ts` barrel) is for shared,
mostly Radix-based UI primitives reused across the whole site.

## The hemoglobin essay internals

`interactives/essays/hemoglobin/` is the most involved subsystem. Read its
`index.ts` header comment first — it documents the section layout (`anatomy/`,
`catching/`, `release/`, `cooperativity/`, `quaternary/`). Key shared
infrastructure:

- **Shared Mol\* 3D engine** — `molstar-engine.ts` (boot/teardown, MolScript
  selections, the "villin look": occlusion + outline + iron emphasis),
  `molstar-chrome.ts` (viewport chrome), and `boot-queue.ts` (a FIFO semaphore
  capping concurrent WebGL boots to avoid jank on fast scroll). Only this module
  imports `molstar`.
- **Client-only rendering** — Mol\* and react-three-fiber crash under SSR, so
  every viewer is loaded via `next/dynamic` with `{ ssr: false }`.
  `Lazy3DFigure.tsx` is the shared figure shell: it lazy-mounts the player only
  once it nears the viewport and pauses it while off-screen, using
  `useInViewport` from `hooks/`.
- **Structure data** — PDB files in `public/structures/` (e.g. `2HHB.pdb` and
  carved/morph derivatives) are loaded by the viewers. They are **generated** by
  the Python scripts in `scripts/` (`carve_anatomy_pdbs.py`,
  `generate_heme_morph.py`, `generate_bohr_morph.py`) from the vendored 2HHB
  structure. Regenerate via those scripts rather than hand-editing the `.pdb`s.
- **`palette.ts`** is the single source of truth for the essay's colors;
  **`Term.tsx`** styles inline domain terms in the prose.

Background docs: `docs/hemoglobin/essay-plan.md` (content plan) and
`docs/hemoglobin/molstar.md` (Mol\* reference). `TODO.md` tracks outstanding work
on this essay.

## article-export tooling

`scripts/article-export/` turns a live essay into a **Substack-ready markdown
doc + static figure screenshots** (for cross-posts that can't run interactives).
Run with the dev server up: `node scripts/article-export/cli.mjs all hemoglobin`,
output in `docs/<slug>/export/`. The load-bearing invariant: **every interactive
renders as a `<figure>`**, in document order, so prose placeholders and
screenshots line up 1:1 with no per-figure wiring. `rules.mjs` is the single
place that knows the essay's component vocabulary — update it there if shared
essay components change. See its `README.md` for the headless-WebGL capture
details.

## Gotchas

- **`build` requires `--webpack`** (already in the npm script). The project is
  not on Turbopack.
- **`three` is pinned to `^0.139.2`**, which predates `BatchedMesh`.
  `@react-three/drei` → `three-mesh-bvh` imports that symbol, breaking the
  webpack production build, so `next.config.js` scopes an `exportsPresence:
  false` parser relaxation to *only* `three-mesh-bvh`. Don't widen it; the real
  fix (tracked in `TODO.md`) is upgrading `three` ≥ r159 with matching
  fiber/drei, which needs a visual check of every 3D interactive.
- **Layout uses CSS custom properties set in JS.** `pages/_app.js` computes
  `--document-width` and `--gutter-size` on resize; the article gutter/content
  width derive from them. Footnotes auto-number via a CSS counter scoped to
  `<article>` (one per essay) in `styles/globals.css`.
- `lib/utils.ts` exports `cn()` (clsx + tailwind-merge) — use it for conditional
  Tailwind classes.

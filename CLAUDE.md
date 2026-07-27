# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Newt Interactive (newtinteractive.com) — a Next.js site of interactive explanatory science essays. Prose is authored in MDX; explanatory figures are React components (2D SVG charts, react-three-fiber / Mol\* 3D models, flow diagrams) rendered inline with the text.

## Commands

```bash
npm run dev      # dev server at http://localhost:3000
npm run build    # production build — note: --webpack (see "Build" below)
npm run start    # serve the production build
```

There is no test runner and no lint script wired up. `npm run build` does type-check (the prior `typescript.ignoreBuildErrors` escape hatch has been removed), so a build failure can be a genuine type error. Note `tsconfig.json` has `strict: false`, so coverage is loose — implicit `any`, null-safety, etc. are not enforced.

### Build: webpack, not Turbopack

`build` is deliberately `next build --webpack`. Turbopack's prod build silently breaks `next/dynamic({ ssr: false })`, which means the lazy-loaded 3D figures (Mol\* viewers, morph players) never mount — the page builds clean but renders empty 3D panes. Do not switch the build to Turbopack without verifying those figures still load. (Dev — `npm run dev` — uses Turbopack and is fine; the bug is prod-only.)

## Architecture

**Two parallel trees.** Content and interactives are kept separate and mirror each other:

- `pages/` — content, organized by type (`essays/`, `series/`, `blocks/`, `notes/`). Each piece is an `index.mdx` (or `.tsx`) under its own folder. MDX is enabled for page files via `@next/mdx` (`pageExtensions` includes `mdx`).
- `interactives/` — the figure components for that content, under matching paths (e.g. `pages/essays/hemoglobin/` ↔ `interactives/essays/hemoglobin/`).

This is the Pages Router (not the App Router). `pages/_app.js` is the global wrapper: it mounts the Vercel `Analytics`, a Radix `TooltipProvider`, and sets the `--document-width` / `--gutter-size` CSS variables used for layout.

**How an MDX essay is wired.** An MDX page:
1. Imports shared primitives from `components` and its figures from the topic's interactive barrel (e.g. `interactives/essays/hemoglobin`).
2. Exports a `metadata` object (title, subtitle, description, keywords, ogImage, url, published, optional `series`/`updated`).
3. Ends with `export default function MDXPage({ children }) { return <MdxLayout metadata={metadata}>{children}</MdxLayout> }`.

`components/MdxLayout` renders all SEO `<Head>` tags from `metadata`, the `Navbar`, `ArticleContainer`, and `ArticleHeader` (which renders title/subtitle/date). `mdx-components.tsx` (`useMDXComponents`) maps raw markdown elements to styled components — note the offset mapping: markdown `###` → `H2`, `####` → `H3`, and `blockquote`/`p`/`ol`/`ul`/`a`/`hr` are all themed there. Author prose in markdown; reach for explicit `<H2>`/JSX only when you need props the mapping can't express.

**Shared UI.** `components/` holds reusable primitives, barrel-exported from `components/index.ts` — import from `"../../../components"`, not deep paths. Many are Radix-based wrappers (Dialog, Popover, Sheet, Tabs, Switch, Slider, etc.). `lib/utils.ts` exports `cn()` (clsx + tailwind-merge) for class composition. Hooks live in `hooks/` (e.g. `useInViewport`, `useMediaQuery`).

**Each interactive topic has a barrel `index.ts`** that is its public surface. The MDX page imports figures only from there, so the internal file layout can change without touching prose. When adding or renaming a figure, update the barrel.

**Styling.** Tailwind (config in `tailwind.config.js`) with a custom theme: prose column is `max-w-prose` (45rem), custom font families (`body`/`title`/`logo`/`quote`), and project color scales. `content` globs cover `pages/`, `components/`, and `interactives/`. Dynamically-constructed class names must be in the `safelist` or they get purged.

## The hemoglobin essay (`interactives/essays/hemoglobin/`)

The most developed essay and the reference pattern for interactive-heavy work. Organized by narrative section — `anatomy/`, `catching/`, `release/`, `cooperativity/`, `quaternary/` — over shared infrastructure:

- `molstar-engine.ts` / `molstar-chrome.ts` / `boot-queue.ts` — the shared Mol\* 3D engine. `boot-queue.ts` is a FIFO semaphore capping concurrent plugin boots so a fast scroll past several viewers doesn't jank.
- `Lazy3DFigure.tsx` — shared shell for 3D figures. Each heavy player is code-split via `next/dynamic({ ssr: false })` and only boots once it nears the viewport (and idles its render loop while off-screen). This lazy lifecycle is the reason the `ssr: false` Turbopack bug above matters.
- `palette.ts` — single source of truth for the essay's colors (chains, effectors, prose terms). Don't hardcode figure colors; pull from here.
- `Term.tsx` — colorizes the first mention of a keyed term in the prose.
- 2D charts (cooperativity) are hand-rolled SVG on a shared `cooperativity/chart.tsx`, not Victory.

**3D structures and morphs.** Static structures and baked morph trajectories are PDB files in `public/structures/`. The Python scripts in `scripts/` (`generate_heme_morph.py`, `generate_bohr_morph.py`, `carve_anatomy_pdbs.py`) regenerate them from `2HHB.pdb`. `anatomy/beats.ts` is deliberately free of any Mol\* import to stay out of the lazy boundary.

**Docs.** `docs/hemoglobin/` holds the non-obvious "why": `essay-plan.md` (narrative content plan, transcribed from notebooks) and `molstar.md` (Mol\* engine, representation recipes, and gotchas). Read `molstar.md` before touching the 3D code. Note a now-removed scene-stepper's code lives only in git history (last at commit `3564e0f`).

## Article export tooling (`scripts/article-export/`)

Converts a live essay into Substack-ready markdown + static figure screenshots. With the dev server running:

```bash
node scripts/article-export/cli.mjs all hemoglobin      # extract → shoot → link captions (the usual one)
node scripts/article-export/cli.mjs record hemoglobin   # record animated figures as looping GIFs (needs ffmpeg)
```

Output lands in `docs/<slug>/export/`. The `cli.mjs` commands are `extract` (MDX → markdown + `figures.json` manifest, no browser), `shoot` (screenshot each figure), `all` (both, plus caption linking), `link` (re-apply captions only), and `record` (GIFs). It relies on every figure rendering as a `<figure>` element in document order so prose placeholders and screenshots line up 1:1. `rules.mjs` is the single place that encodes the project's component vocabulary (footnote/term/heading components, figure-naming props) — update it there if shared essay components change.

`record` (`record.mjs`) captures the same region as `shoot` but scrubs an animated figure and stitches the poses into a looping GIF. It runs one ad-hoc figure (`--figure <sel> --name <basename> [--sweep ...]`) or, with no target, every entry in that essay's `pages/essays/<slug>/recordings.json` manifest (`defaults` + a `recordings` array keyed by figure selector). See `scripts/article-export/README.md` for the headless-WebGL screenshot gotcha, the GIF capture modes, and per-essay `export.config.json` overrides.

## Homepage (`pages/index.tsx`, `lib/content.ts`, `components/CoverArt/`)

The homepage is a single centred column (`max-w-column`, 46rem): a one-line
statement of what the site is, a rule, the featured piece, then a dated index of
everything else. `lib/content.ts` is the catalogue — one `Piece` row per
published thing, with `title`/`subtitle` copied verbatim from that page's own
exported `metadata`. The homepage can't import those `metadata` objects
directly (that would pull every essay's interactives into the homepage bundle),
so **adding a piece means adding a row there**.

Covers are **drawn, not screenshotted**. `components/CoverArt/` is the whole
system: every cover is built from the same three primitives (node, edge, field)
on the same paper ground, at the same stroke weights, from one indigo ramp. A
row sets `art: "<motif>"` and gets an inline SVG — no image pipeline, crisp at
both the 46rem featured size and the 160px index thumb. Adding a piece means
adding a ~20-line motif beside the others.

Three rules hold the set together, and breaking any one of them is what made the
old screenshot covers look unrelated:

- **No text inside the art, ever.** Type sized for a full-width figure is
  illegible at thumb size and gets sliced by any crop.
- **Everything inside the safe band** (x 40–280, y 30–150 of a 320×180 frame),
  so one drawing serves both sizes without a second crop.
- **Exactly one red element per cover**, on the thing worth looking at — the
  measurement, the mutation, the mode of the belief. Indigo carries structure.

`cover: "<path>"` is the escape hatch for a piece that already has a better
image than a motif would be. Right now that's only hemoglobin, whose red heme
illustration sets the accent the drawn covers pick up one element at a time.

`scripts/covers.mjs` still shoots stills from the live pages into
`public/images/covers/` (dev server running) if you ever want that route back:

```bash
node scripts/covers.mjs                 # every piece
node scripts/covers.mjs dna c1-ffl      # just these
```

It reuses the headless-Chrome core from `article-export/capture.mjs`, and its
`COVERS` array is where each piece's target lives — a `<figure>` index for the
hemoglobin essay (the only piece that renders figures) or a plain CSS selector
for everything older, plus optional `actions` for interactives that start empty
(Erdős-Rényi, the Kalman tutorial) and `inner` to shoot the drawing rather than
the widget around it. Two files land per piece: a 1600×900 cover and a 600×338
detail-cropped `-thumb` (`thumbFor()` only swaps in the `-thumb` for paths under
`/images/covers/`, so hand-made covers elsewhere are served whole). The script
clears `.next/dev/cache/images` when it finishes — `next/image` keys its cache
on a URL that doesn't change when a cover is re-shot, and caches per output
format, so a stale WebP will otherwise outlive a freshly written PNG.

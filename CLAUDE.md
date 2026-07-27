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

- `pages/` — content, organized by type (`essays/`, `series/`, `blocks/`, `notes/`). Each piece is an `index.mdx` (or `.tsx`) under its own folder. MDX is enabled for page files via `@next/mdx` (`pageExtensions` includes `mdx`). There is no per-type landing page: the homepage indexes everything, so `/notes` was an orphan on the old poster-card design and is gone (last at commit `b519c5b`). `components/HomeTopicCard` was its only consumer and is now unreferenced — kept on disk like the other legacy card components.
- `interactives/` — the figure components for that content, under matching paths (e.g. `pages/essays/hemoglobin/` ↔ `interactives/essays/hemoglobin/`).

This is the Pages Router (not the App Router). `pages/_app.js` is the global wrapper: it mounts the Vercel `Analytics`, a Radix `TooltipProvider`, and sets the `--document-width` / `--gutter-size` CSS variables used for layout.

**How an MDX essay is wired.** An MDX page:
1. Imports shared primitives from `components` and its figures from the topic's interactive barrel (e.g. `interactives/essays/hemoglobin`).
2. Exports a `metadata` object (title, subtitle, description, keywords, ogImage, url, published, optional `series`/`updated`).
3. Ends with `export default function MDXPage({ children }) { return <MdxLayout metadata={metadata}>{children}</MdxLayout> }`.

`components/MdxLayout` composes three things: `SeoHead` (all SEO `<Head>` tags, generated from `metadata`), `PageShell` (the site chrome), and `ArticleContainer` + `ArticleHeader` (which renders title/subtitle/date) around the children.

`components/PageShell` is the chrome, and every page goes through it: `Navbar`, a `<main>` that grows, `Footer`, in a `min-h-screen` flex column — so the footer sits at the bottom of the viewport on a short page instead of halfway up it, and every page has exactly one `<main>` landmark. `components/SeoHead` is the tag set, from a `SeoMetadata` object; `ogType` is the only thing an index page varies (`"website"` rather than the default `"article"`).

A page built by hand rather than from MDX still renders through `MdxLayout` — the series index does, passing a `metadata` object built from its own catalogue row. There used to be three hand-written copies of the chrome and of the `<Head>` block, and they had already drifted (two pages shipped no `<main>`; the series page shipped no `twitter:creator` and named itself in four places). The homepage is the one page that skips `MdxLayout` — it isn't an article, so it wants `SeoHead` + `PageShell` without `ArticleContainer`.

`mdx-components.tsx` (`useMDXComponents`) maps raw markdown elements to styled components — note the offset mapping: markdown `###` → `H2`, `####` → `H3`, and `blockquote`/`p`/`ol`/`ul`/`a`/`hr` are all themed there. Author prose in markdown; reach for explicit `<H2>`/JSX only when you need props the mapping can't express.

**Shared UI.** `components/` holds reusable primitives, barrel-exported from `components/index.ts` — import from `"../../../components"`, not deep paths. Many are Radix-based wrappers (Dialog, Popover, Sheet, Tabs, Switch, Slider, etc.). `lib/utils.ts` exports `cn()` (clsx + tailwind-merge) for class composition. `lib/links.ts` holds the contact URLs (Twitter, the `mailto:`), which the footer and both "get in touch" paragraphs read rather than each spelling out. Hooks live in `hooks/` (e.g. `useInViewport`, `useMediaQuery`).

**What does *not* go in the barrel.** `pages/_app.js` imports from it, and it isn't tree-shaken (no `sideEffects: false`, and the components pull in CSS modules), so **anything listed in `components/index.ts` ships in the chunk every page downloads.** Keep it to genuine shared primitives. `components/Homepage` (the index rows, which drag in `CoverArt` and the whole catalogue) is therefore imported deep, by the two pages that render it — as is `HomeTopicCard` and the rest of the legacy card set, which nothing renders at all. Note the barrel already pulls `three`/`reactflow`/`katex` into `_app` via its 3D and Flow exports; that's a much bigger pre-existing bill and worth fixing separately.

**Each interactive topic has a barrel `index.ts`** that is its public surface. The MDX page imports figures only from there, so the internal file layout can change without touching prose. When adding or renaming a figure, update the barrel.

**Styling.** Tailwind (config in `tailwind.config.js`) with a custom theme: prose column is `max-w-prose` (45rem), custom font families (`body`/`title`/`ui`/`mono`/`logo`/`quote`), and project color scales. `content` globs cover `pages/`, `components/`, and `interactives/`. Dynamically-constructed class names must be in the `safelist` or they get purged.

The site ground is `bg-paper`, applied once to `<body>` in `styles/globals.css` — not per page. It used to sit on the homepage's own wrapper, which meant clicking any title turned the paper white under a navbar whose glass is tinted for paper, and the seam showed at the top of every article. Nothing else should set a page background; a figure panel that wants to lift off the paper uses white or `bg-ink-100/60`.

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

The homepage is a single centred column (`max-w-column`, 46rem): the featured
piece at full column width, a dated index of everything else, then — down by
the subscribe form, where a colophon goes — a one-line statement of what the
site is. `lib/content.ts` is the catalogue — one `Piece` row per
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
- **Space repeated elements by their edges, not their centres.** Where a motif
  shows the same thing several times over (the `generations` ramp), each
  repetition is a different width, so even centre spacing leaves uneven gaps
  and the wide ones clump.
- **Exactly one red element per cover**, on the thing worth looking at — the
  measurement, the mutation, the mode of the belief. Indigo carries structure.

The indigo/red ramp in `CoverArt`'s `C` is literal hexes on purpose — it's the
motif vocabulary, and it's meant to stay put. The two colours that *aren't* part
of that vocabulary take Tailwind classes instead: the ground is `fill-paper` and
a chart motif's baseline is `stroke-ink-400`, so both follow the site's tokens
rather than freezing a copy of them. A hardcoded `#FBFAF7` ground meant retuning
`paper` would leave a visible rectangle seam inside all eight cover frames.

A row's `accent` sets the hover colour of its title, as a `--accent` CSS variable
on the row's link (a class written in `lib/` would be purged — Tailwind's content
globs don't cover it). **Every** row type sets it, defaulting to indigo-700, so
making a different piece featured doesn't quietly kill the accent it had.

`cover: "<path>"` is the escape hatch for a piece that already has a better
image than a motif would be. Right now that's only hemoglobin, whose red heme
illustration sets the accent the drawn covers pick up one element at a time.
There is no capture pipeline any more — an earlier `scripts/covers.mjs` shot
stills from the live pages, and it's gone (last at commit `caff1ee`) because
the drawn covers replaced everything it produced.

**One grey, not five.** The site's neutrals are the custom `ink` scale in
`tailwind.config.js`, not Tailwind `slate` — every stop is the same desaturated
indigo (h 248°), so the greys read as a quiet cousin of the accent. Tailwind's
`slate` is cast bluer than the warm paper under it, which is what made 15px
subtitles look faintly wrong. 900 titles · 700 body prose · 600 archive titles ·
500 subtitles and labels · 400 dates · 200 hairlines. Move them together —
warming one and leaving its neighbours slate just relocates the mismatch.

It started on the homepage and now runs through everything that frames a page:
the article header and date, `Paragraph`/`Headings`/the lists/`Quote`, the MDX
link and rule mappings, `Button`, `SeriesNavigation`, the subscribe block.
What's deliberately still on `slate` is the UI *inside* figures — `Slider`,
`Tabs`, `Dialog`, `Sheet`, `Popover`, the tooltips, the Flow nodes — because
those sit against a figure's own palette rather than against paper.
`ArticleHeader`'s subtitle is the one place that isn't a like-for-like swap: it
went `slate-400` → `ink-500`, the scale's subtitle role, because at 18px on
paper 400 is the grey that reads as faintly wrong.

**Three type registers, and nothing else.** `font-title` (DM Serif Display) for
titles, `font-ui` (Inter) for the standfirst, subtitles and dates, `font-mono`
(Fira Mono) for the kind labels. `font-mono` also overrides Tailwind's default
stack, which finally gives `prism-one-dark.css` a Fira to use instead of falling
through to system Menlo.

Every face is fetched by **one** `@import` in `styles/fonts.css`, and it should
stay that way. A CSS `@import` is invisible to the browser's preload scanner —
it has to download and parse the whole 86 KB stylesheet, then fetch the font CSS,
then the woff2s — so each separate import was another serialized round trip in
front of first paint on every page. The css2 endpoint takes any number of
`family=` params (alphabetical order required), so six imports became one. Add a
face by extending that URL, not by adding a line.

A series row lists its instalments under it: `parts` is an array of
`{href, title, published, section?}`, numbered, dated, on lighter rules than the
index's own. The `title` there is the series page's own short label, not the
article's metadata title — the list is numbered, so "Part One" would be said
twice. Note `PieceRow` wraps its link around the row only, with the parts
hanging below as their own links; an anchor can't legally contain anchors.

The series' **own** page renders the same `PartsTable` from the same `parts`
array (`getPiece(href)` + `partsBySection`), so there is one list to keep in
order rather than a second hand-written copy — that copy used to be a pair of
blue-link `<OrderedList>`s that drifted from the index. What that page adds is
the grouping: `section` on a part puts it under a subheading there, numbering
running on across the groups, and the homepage ignores it and stays flat (an
index row shows the shape of a series, not its table of contents), and sets
those subheadings in the index's mono-caps label register rather than as prose
headings — they name a group of rows, and the numbered table under each is
already doing the talking. `nested` on `PartsTable` carries every visual
difference between the two placements: nested (the default, under an index row)
the dates are held off the column edge and the titles sit a shade back at
`ink-500`, so the list reads as that row's contents; standalone, the table *is*
the column, so the dates go flush — an inset one wouldn't line up with the rule
above it — and the titles come up to `ink-600`, there being nothing left for
them to defer to.

The navbar's Subscribe goes to the nearest subscribe block: the `id="subscribe"`
on `PostArticleSubscribe`'s rule if this page has one, the homepage's otherwise.
That can only be decided in the browser — `MdxLayout` can't see whether the MDX
below it ends with a subscribe block — so the `href` stays `/#subscribe` (right
without JS, right for a middle-click) and the click handler prefers a local one.

Clearing the sticky navbar when you land on an anchor is `html { scroll-padding-top }`
in `styles/globals.css`, not a `scroll-mt` on each anchor. Set once, the next
`id` added anywhere is right by default — otherwise it lands under the glass and
looks like a bug in whatever feature added it.

`SubscribeForm`'s two variants are **the same form, differently wrapped**. The
type, the fields and the greys are identical; `variant="card"` only adds a
panel, so at the foot of a long article the ask reads as something to act on
rather than one more paragraph. The panel is the navbar's glass without the
blur — the same `bg-indigo-50/75` over the same `border-indigo-200/50` — so the
two tinted surfaces on a page are the same tint. (They used to be two different
designs: the card was a `slate-100` block with bold sans, which is what the
navbar's Subscribe link reliably delivered people to.)

**One `<h1>` per page, in document order.** On the homepage that's the featured
piece's title; the closing statement of what the site is is a `<p>`, because it
stopped being the page's header when it moved to the bottom — as an `<h1>` down
there it left the outline running h2 → h3 → h1. Index rows are `<h2>`, matching
the Archive label beside them.

The index opens on a rule with no heading over it — the rows say what they are,
so a label there was naming the obvious. Below it, `archived: true` on a row
moves that piece into the **Archive**: a labelled list (this one does need
naming) of title and date on one line, no cover, no subtitle, darkening on
hover instead of going indigo. It's for things kept on the record rather than
shown off — right now, DNA in 3D.

**No middots.** The meta line is kind, extent, date with nothing between them —
the registers (mono caps / sans / sans tabular figures) and a `gap-x-4` do the
separating. A row of dots reads as one compressed sentence; three registers
read as three fields. Dates are abbreviated (`Jun 2026`) and set in
`tabular-nums` with a little extra tracking, because at 12px grey the default
proportional figures clump next to the words beside them.

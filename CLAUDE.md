# CLAUDE.md

Newt Interactive (newtinteractive.com) — a Next.js site of interactive science
essays. Prose is MDX; figures are React components (SVG charts,
react-three-fiber / Mol\* 3D, flow diagrams) rendered inline with the text.

## Commands

```bash
npm run dev      # localhost:3000 (Turbopack)
npm run build    # production build (webpack — see below)
npm run start    # serve the production build
```

No tests, no lint. `build` type-checks, but `tsconfig.json` sets `strict: false`.

### The bundler split

Dev runs Turbopack, `build` runs webpack (`next build --webpack`), and each
breaks what the other doesn't. **Suspect this first when something works in one
and not the other.**

- Turbopack's **prod** build silently breaks `next/dynamic({ ssr: false })`: the
  lazy 3D figures never mount, so the build is clean and the 3D panes are empty.
  Don't drop `--webpack` without checking they load.
- Turbopack drops external `@import url()` in CSS — hence `next/font` in
  `lib/fonts.ts` rather than a stylesheet import.

### The browserslist floor

`package.json` pins `safari >= 15.4` / `ios_saf >= 15.4`. **Don't "modernise"
that query to `last N versions` or `defaults` alone** — Safari ships 26.x now,
so those resolve to Safari 26 only, and autoprefixer stops emitting
`-webkit-backdrop-filter`. Safari didn't take that property unprefixed until
18.0, so the navbar's frosted glass degrades to a flat translucent pane on every
Safari and iOS below 18, with a clean build and no warning.

Hand-writing the prefix doesn't rescue it: autoprefixer owns `backdrop-filter`
and `remove: true` is its default, so it deletes any prefixed declaration its
targets say is unnecessary. The targets are the only lever.

## Architecture

Pages Router. Content and figures are parallel trees:
`pages/essays/hemoglobin/` ↔ `interactives/essays/hemoglobin/`. Pages are
grouped by type (`essays/`, `series/`, `blocks/`, `notes/`), each piece an
`index.mdx` (or `.tsx`) in its own folder. There are no per-type landing pages —
the homepage indexes everything.

An MDX page imports primitives from `components` and figures from its topic
barrel, exports `metadata` (title, subtitle, description, keywords, ogImage,
url, published, optional `series`/`updated`), and default-exports
`({children}) => <MdxLayout metadata={metadata}>{children}</MdxLayout>`.
`MdxLayout` is `SeoHead` + `PageShell` (Navbar/`<main>`/Footer) +
`ArticleContainer`; hand-built pages pass a `metadata` object through it too,
and the homepage is the one exception, skipping `ArticleContainer`.

`mdx-components.tsx` themes markdown with an **offset heading map: `###` → `H2`,
`####` → `H3`.** Author prose in markdown; reach for JSX only for props the
mapping can't express.

## Rules

- **Import shared UI from the `components` barrel**, not deep paths. `cn()` is in
  `lib/utils.ts`.
- **Don't add to `components/index.ts`.** `_app` imports it and it isn't
  tree-shaken, so anything listed ships in every page's chunk. Primitives only —
  `components/Homepage` is deliberately imported deep by its two pages.
- **A topic's `index.ts` is its public surface.** Prose imports figures only from
  there, so update it when adding or renaming one.
- **A new published piece needs a row in `lib/content.ts`** — the homepage
  catalogue, `title`/`subtitle` verbatim from that page's `metadata`. It can't
  import those objects without pulling every essay's interactives into the
  homepage bundle.
- **Never set a page background.** `bg-paper` is on `<body>` in
  `styles/globals.css`.
- **Figures sit on the paper** — no white fill, no frame. The Mol\* canvas
  clears to `PAPER` in `palette.ts`, which must equal Tailwind's `paper`. White
  stays for the T↔R tab thumb and the `PartsManifest` frame.
- **`ink`, not Tailwind `slate`,** for anything framing a page. `slate` stays in
  the UI *inside* figures (Slider, Tabs, Dialog, Sheet, Popover, tooltips, Flow
  nodes), which sits against a figure's palette rather than paper.
- **Three type registers:** `font-title` titles, `font-ui`
  standfirst/subtitles/dates, `font-mono` labels and code; prose is `font-body`.
  A new face means a `next/font` loader in `lib/fonts.ts` plus a key in
  `tailwind.config.js` — a family named directly in Tailwind won't resolve,
  since next/font hashes family names, and the classes go on `<html>` in
  `_document.tsx` so Radix portals into `<body>` stay in scope.
- **One `<h1>` per page**, in document order. Index rows are `<h2>`.
- **Dynamic class names need the Tailwind `safelist`.** Content globs cover
  `pages/`, `components/`, `interactives/` — not `lib/`, so a colour decided
  there travels as a CSS variable (`--accent`), never a class.
- **Never hardcode a hemoglobin figure colour** — `palette.ts` is the source of
  truth.

## Comments

Comments drift; the code doesn't. One that restates a value, a decision, or a
cross-file relationship goes stale the moment either side moves, and the next
reader takes it as truth. **The default is no comment.** The *why* lives in this
file and in `docs/hemoglobin/molstar.md` — don't re-narrate it inline.

Before writing one, ask: *is this a non-obvious invariant at this line that I
can't recover by reading the code?* If not, don't. Never write:

- **Value restatement** — a width, count, threshold, or class string the code
  already holds (`45rem`, `320×180`, `bg-ink-100/60`). When the code changes,
  the prose lies. This is the drift the rule exists for.
- **Decision re-narration** — the reasoning behind a palette entry, a layout
  choice, a lazy boundary. Plus plan pointers ("per the plan") and "for now /
  until we…" notes.
- **Call-site enumeration** — "used by the anatomy beats", "shared by both
  players". Find-references owns this and the list rots.
- **"mirrors X" / "matches Y" pointers.** If two files genuinely must stay in
  sync, state the *consequence of drift at the line* ("must match the
  `safelist` entry or the class is purged"), not "mirrors palette.ts".
- **History** — "extracted from…", "replaces the old…", "was Victory".
- **Restatement of the adjacent code.**

Keep three things. A **non-obvious invariant**, cut to the invariant clause with
no decorative label — `// No Mol* imports — this sits outside the lazy
boundary.` **One terse purpose line** atop a non-trivial file: what it is, never
how it works or who calls it, and skipped entirely when the name already says it
(small primitives, one-liner hooks). **Functional comments**, left exactly as
they are: `eslint-disable`, `@ts-expect-error`, `prettier-ignore`, actionable
`TODO:` / `FIXME:`.

When in doubt, delete. The only thing you must never drop is a true invariant
whose loss would let someone reintroduce a bug.

## Design detail

Columns are `max-w-prose` (45rem) for essays, `max-w-column` (46rem) for the
homepage. The index meta line has **no middots** — kind, extent and date are
separated by their registers and a `gap-x-4`.

**Covers (`components/CoverArt/`)** are drawn, not screenshotted: inline SVG
from three primitives (node, edge, field), so a new piece means a ~20-line motif
beside the others (`art: "<motif>"`, or `cover: "<path>"` as the escape hatch).
Its ramp is literal hex on purpose — that's the motif vocabulary — while colours
outside it take Tailwind classes to track the site's tokens (`fill-paper`,
`stroke-ink-400`). Four rules keep the set related:

- **No text inside the art** — illegible at the 160px thumb, sliced by any crop.
- **Everything inside the safe band** (x 40–280, y 30–150 of 320×180), so one
  drawing serves thumb and featured sizes.
- **Space repetitions by their edges, not their centres** — they're different
  widths, so centre spacing clumps the wide ones.
- **Exactly one red element**, on the thing worth looking at. Indigo carries
  structure.

## The hemoglobin essay (`interactives/essays/hemoglobin/`)

The reference pattern for interactive-heavy work: narrative sections
(`anatomy/`, `catching/`, `release/`, `cooperativity/`, `quaternary/`) over
shared infrastructure.

- `molstar-engine.ts` / `molstar-chrome.ts` / `boot-queue.ts` — the shared Mol\*
  engine; `boot-queue.ts` caps concurrent plugin boots so a fast scroll past
  several viewers doesn't jank.
- `Lazy3DFigure.tsx` — each heavy player is `next/dynamic({ ssr: false })`, boots
  near the viewport, idles off-screen. This is what the Turbopack bug breaks.
- `palette.ts` for colour, `Term.tsx` for a term's first mention in prose.
- Cooperativity's charts are hand-rolled SVG on `cooperativity/chart.tsx`, not
  Victory.
- PDBs in `public/structures/` are regenerated from `2HHB.pdb` by the Python
  scripts in `scripts/`. `anatomy/beats.ts` stays free of Mol\* imports to stay
  outside the lazy boundary.

**Read `docs/hemoglobin/molstar.md` before touching the 3D code.**

## Article export (`scripts/article-export/`)

A live essay → Substack-ready markdown + figure screenshots, into
`docs/<slug>/export/`. Needs the dev server up.

```bash
node scripts/article-export/cli.mjs all hemoglobin      # extract → shoot → link captions
node scripts/article-export/cli.mjs record hemoglobin   # animated figures as GIFs (needs ffmpeg)
```

It relies on every figure rendering as a `<figure>` in document order, so prose
placeholders and screenshots line up 1:1. `rules.mjs` encodes the project's
component vocabulary — update it there when shared essay components change. The
remaining commands and the headless-WebGL gotcha are in that folder's
`README.md`.

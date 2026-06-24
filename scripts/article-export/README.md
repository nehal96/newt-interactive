# article-export

Turn an interactive newt essay into a **Substack-ready markdown doc** plus a
folder of **static figure screenshots** — for newsletters, cross-posts, and
other places that can't run the live interactives.

```bash
# 1. make sure the dev server is up
npm run dev

# 2. one command: extract prose + shoot every figure + link captions
node scripts/article-export/cli.mjs all hemoglobin
```

Output lands in `docs/<slug>/export/`:

```
docs/hemoglobin/export/
  essay.md          # prose, footnotes at the bottom, image placeholders
  figures.json      # manifest (one entry per figure)
  figures/          # NN-name.png, retina, ≤1400px wide, 28px white margin
```

## What it does

Two halves that share an ordered **figure manifest**:

- **`extract`** reads `pages/essays/<slug>/index.mdx` and produces the markdown:
  - `TippyTooltip` footnotes → `[^n]` markers collected under `## Footnotes`
  - `Term` wrappers stripped, `<H2>` → `##`, `&mdash;`/`<sub>` normalized
  - every block-level figure component → a placeholder:
    `> **[Image — `02-iron.png`]** alt text`
  - the subscribe/CTA blocks dropped
- **`shoot`** boots a headless page, finds every `<figure>` in document order,
  and screenshots each — 3D (Mol* / react-three-fiber), morph **players**
  (canvas + play/slider, captured at frame 0), and 2D charts (default state),
  all handled automatically.
- **`link`** (folded into `all`) writes each figure's rendered caption back into
  its placeholder's alt text.

The linchpin: every interactive renders as a `<figure>`, and the MDX components
map to those `<figure>`s 1:1 in order — so prose placeholders and screenshots
line up automatically, no per-figure wiring.

## Commands

| Command | Needs dev server | Does |
|---|---|---|
| `extract <slug>` | no | MDX → `essay.md` + `figures.json` |
| `shoot <slug>`   | yes | screenshot figures from an existing manifest |
| `all <slug>`     | yes | extract → shoot → link (the usual one) |

Flags: `--out <dir>`, `--base-url <url>` (default `http://localhost:3000`),
`--pad <px>` (default 28), `--max-width <px>` (default 1400), `--port <n>`.

## Per-essay overrides

Optional `pages/essays/<slug>/export.config.json`, keyed by generated filename:

```json
{
  "figures": {
    "02-iron.png": { "alt": "A single ferrous iron ion at the center of the heme." },
    "10-binding-morph.png": { "alt": "…", "frame": 0 }
  }
}
```

- `alt` — overrides the placeholder alt (beats have no figcaption, so a hand
  alt reads better). Otherwise: figcaption › a guess from the component name.
- `frame` — drive a morph player's slider to a frame before capture.

## Tuning the component vocabulary

`rules.mjs` is the one place that knows newt's components (footnote/term/heading
components, drop-blocks, figure naming props). Edit it there if the shared essay
components change.

## How the screenshots work (the headless gotcha)

Headless Chrome drops GPU-composited canvas layers (WebGL) from normal
screenshots. The fix, baked into `capture.mjs`: launch with software GL
(SwiftShader) + `--disable-gpu-compositing`, and capture with
`captureBeyondViewport`. Then WebGL figures composite into a plain screenshot
like any other DOM — no canvas-readback tricks needed. Mol* renders its canvas
at 1×, so the capture briefly nudges it to 2× for retina output.

## Requirements

- Node ≥ 21 (uses the built-in global `WebSocket`)
- Google Chrome (override path with `CHROME_BIN`)
- `sharp` (already a dependency) for padding/downscaling

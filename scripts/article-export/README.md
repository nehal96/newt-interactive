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
| `record <slug>`  | yes (+ ffmpeg) | record one animated figure as a looping **GIF** |

Flags (extract/shoot/all): `--out <dir>`, `--base-url <url>` (default
`http://localhost:3000`), `--pad <px>` (default 28), `--max-width <px>` (default
1400), `--port <n>`.

## Recording a figure as a GIF

`record` is the moving sibling of `shoot`. It captures the **same region** as the
screenshot — the figure's visual plus its controls, so the GIF has the same
framing and aspect ratio as the still — but instead of one frame it captures the
whole animation and stitches the poses into a looping GIF with ffmpeg
(`palettegen`/`paletteuse`, far cleaner than a naive palette).

```bash
# a Mol* morph player (scrub mode)
node scripts/article-export/cli.mjs record hemoglobin \
  --name oxygen-binding --figure "movement are not drawn"

# a 2D toggle figure (tween mode)
node scripts/article-export/cli.mjs record hemoglobin \
  --name tense-relaxed-switch --figure "subunits sit apart"

# a slider chart, walked through named checkpoints (sweep mode)
node scripts/article-export/cli.mjs record hemoglobin --figure 14 \
  --name lungs-to-muscle --sweep "lungs,resting tissue,working muscle"
```

All three strategies are deterministic — a headless screenshot takes far longer
than an animation frame, so capturing real-time playback would sample unevenly
and tear. `record` picks the mode from the figure (or `--sweep`):

- **scrub** — morph players (Mol*) expose a frame slider. It drives the slider
  one frame at a time, waiting for the engine to settle between captures. The
  play button's glyph is forced per frame so the loop reads like a real
  recording — **play** on the opening hold, **pause** through the morph,
  **replay** on the closing hold (disable with `--no-play-icon`).
- **tween** — toggle figures (the 2D T↔R switch, the 2,3-BPG doorstop) animate a
  `requestAnimationFrame` + `performance.now` tween on a button click. It
  installs a **virtual clock** (queues rAF, freezes `performance.now`), clicks
  the toggle, then advances the clock in even steps and snapshots each — no
  per-figure pose maths, just *advance time, let React render, capture*. Captured
  as a T→R→T round trip so the loop is seamless.
- **sweep** (`--sweep`) — a slider chart walked through a list of checkpoints,
  sweeping smoothly between them and pausing at each. A checkpoint is a raw
  slider value or a **preset-button label** (clicked to read where the slider
  lands), so the journey reads in the figure's own words —
  `--sweep "lungs,resting tissue,working muscle"` drives pO₂ 95 → 40 → 20, the
  curve marker descending and the O₂ seats emptying as a red cell unloads from
  lungs to tissue. Loops back to the first checkpoint for a seamless cycle
  (`--no-loop-back` to stop after the last).

`--figure` picks the figure: a document-order index, a figcaption substring
(both resolve without mounting), or `first-player` (the default — scans for the
first canvas+slider figure, mounting lazy figures as it goes; pass an explicit
index/caption to skip the scan when several lazy 3D figures precede the target).

Record flags: `--out <file>` or `--name <basename>`, `--figure <sel>`,
`--fps <n>` (default 20 — in tween mode the GIF plays the transition at real
speed), `--frames <n>` (scrub: default every baked frame),
`--max-width <px>` (default 800), `--pad <px>` (default 28),
`--settle <ms>` (per-step wait; default 500 scrub / 80 tween / 40 sweep),
`--start-hold <ms>` / `--end-hold <ms>` (default 600 / 900 — the opening and the
middle/R hold), `--no-play-icon`. Sweep mode: `--sweep <list>`,
`--checkpoint-hold <ms>` (default 1000), `--sweep-rate <units/sec>` (default 45),
`--no-loop-back`. Plus `--keep-frames`, `--port <n>` (default 9223). Needs
`ffmpeg` on `PATH` (or `FFMPEG_BIN`).

### A recordings manifest (the usual way)

Rather than remember a command per figure, list an essay's GIFs in
`pages/essays/<slug>/recordings.json` and produce them all at once:

```bash
node scripts/article-export/cli.mjs record hemoglobin        # every recording
node scripts/article-export/cli.mjs record hemoglobin --only bpg-doorstop
```

```json
{
  "defaults": { "fps": 20, "maxWidth": 800 },
  "recordings": [
    { "name": "oxygen-binding", "figure": "movement are not drawn" },
    { "name": "tense-relaxed-switch", "figure": "subunits sit apart" },
    { "name": "lungs-to-muscle", "figure": 14,
      "sweep": ["lungs", "resting tissue", "working muscle"] }
  ]
}
```

Each entry is a recording **spec** — `name` (the output basename) plus any
`recordFigure` option (`figure`, `sweep`, `fps`, `maxWidth`, `checkpointHoldMs`,
…); `defaults` apply to every entry, an entry overrides them. The mode is still
auto-detected per figure, so one manifest mixes morphs, toggles and charts.
`record <slug>` with `--figure`/`--name`/`--sweep` records that one figure
ad-hoc instead; with none, it runs the manifest.

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

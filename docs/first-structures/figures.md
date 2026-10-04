# First-structures figures: brief

What a new session needs to keep building figures for
`pages/essays/first-structures/` the way Explainer 1 was built. The code shows
*how*; this is the *why* and the taste behind it.

## What the author wants

- **Every figure must be accurate. Never guess.** Every film, band and spot is
  computed from the atoms actually drawn. Nothing is placed by hand. Any fact
  that isn't computed (dimensions, dates, apparatus) comes from a source we
  have read. If no source says it, leave it out or label it generically.
- **The prose leads; figures support it.** A figure must not cut a story
  paragraph in half. Prefer placing a figure where the text has just raised
  its idea. Explanation that the story only needs later is introduced at that
  later moment, reusing the same visual language, not front-loaded.
- **Start sparse.** The author repeatedly asked to cut clutter: fewer labels,
  fewer rings, no decorative lines. Draw the one idea; add only what the
  reader needs to get it.
- **Static by default.** Interactive only when moving something reveals the
  idea (atom spacing, number of atoms). Sliders sit under the panel they
  control. Sequences are stacked panels read top to bottom, never tabs or
  steppers. Each panel goes heading → one "what to notice" sentence → drawing.
- **Compact.** Keep figures short; the author asked several times for less
  height.

## Writing figure text

- Plain, short, like the essay's prose. No jargon the reader hasn't met
  ("collimator" became "narrow tube", "picein seal" became "seal"). No AI
  phrasing, no leftovers from design discussions.
- **Don't describe what the reader can see.** "X-rays come in from the left"
  is wrong; "When X-rays hit an atom, it sends out ripples" is right. Explain
  why, not where.
- Title = the finding as a sentence. Subtitle = the explanation (optional; cut
  it if the panels already say it). Caption = one line of what's simplified
  and the sources, nothing else.
- Don't repeat what the surrounding prose already says.

## Editing the author's prose

Never edit it silently. Mark every change against their draft commit
`dcde212` with `<Add>` (highlight), `<Cut>` (strikethrough) and
`<AddParagraph>` for a whole new paragraph (a lone tag in MDX isn't wrapped in
a `<p>`). They accept or reject the marks themselves.

## Visual language

- `palette.ts` `XR`: blue = X-rays and ripples; red = the one thing that
  matters (waves adding, the sum, the unit cell, "in step"); greys for
  structure. One red idea per figure.
- The beam is an arrow (`BeamArrow`); a wave drawn as a line next to straight
  crest lines read as "two waves". Ripples are circles at their crests. Red
  dots mark where a crest meets a crest. The beam stop is a small fixed-size
  block, labelled once per figure.
- Film: edge-on strip in the side-view figures, face-on square once the
  crystal figure has turned it. It's paper-white so it reads as a sheet on the
  grey card.
- Figures sit on a rounded grey card (`bg-card`, `#F2F1ED`). This deliberately
  departs from CLAUDE.md's "figures sit on the paper" for this essay only.
  Label halos use `XR.card` and must match it.
- Labels sit next to what they name; no legends. Text is small: 10/11 px
  labels, 11/12 px panel headings.

## Building blocks (`figures/`)

- `Figure` (title, subtitle, caption, `side`), `Variant` (first listed shows
  first), `Wrap`. A `side` figure floats right of the prose on desktop and
  must sit inside a `<Wrap>` together with the paragraphs it wraps beside,
  because the article column is a flex container and floats don't work in
  it directly.
- `useElementWidth` (`@hooks`): figures lay out in real pixels, not a
  scaled viewBox, so text stays legible on phones. Branch layouts on width.
- `scatter.ts`: film exposure from point atoms by exact path length, the beam
  stop's shadow, and crest crossings. `spots.tsx`: spots from a flat 2D
  lattice seen face-on. `oscillation.ts`: real rocked-crystal spot positions
  in 3D (horse methaemoglobin is space group C2, so h + k odd spots are absent).
  `scene.tsx`: shared beam, ripples, stop and film pieces.

## Sources (the author's PDFs, in `~/Downloads`)

- `bernal1934.pdf`: wet crystals in capillaries; dry crystals give nothing.
- `bernal1938.pdf`: the cell (109 × 63.2 × 54.2 Å, β 112°, C2), the 5°
  photograph (cropped into `public/images/first-structures/`; reproduction
  rights still to clear).
- `perutz1942.pdf`: drying and the sheet model.
- `perutz1946.pdf`: the Unicam camera, nickel filter, about 12 hours per
  exposure.
- `boyes-watson1947.pdf`: a scan with no text layer; journal page = PDF
  page + 82. Gives the capillary mount (p. 90), flat films at 5–10 cm, 3–5°
  rocks.
- No paper mentions a beam stop; the clear centre of every photograph is the
  evidence for drawing one.

## Checking your work

- `npm run check` does **not** compile MDX. After editing `index.page.mdx`,
  curl the page and look for a 500.
- Look at every figure at 375 px and 1024 px. Headless Chrome via
  `launchChrome` / `Page` from `scripts/article-export/capture.mjs`,
  `Emulation.setDeviceMetricsOverride` for the width, `captureClip` on the
  figure's rect. A Radix tab only switches on mousedown + focus + click. The
  in-app Browser pane returns stale or zero measurements when hidden.

## Where things stand

As of 2026-10-04 the first set is built. In essay order:
1. Explainer 1: waves (static and interactive variants still both offered),
   `Scattering`, crystal (side), camera with the 1938 photograph.
2. Winter 1937–38 (one Wrap, two side floats): unit-cell spacing, then
   `WhatTheFilmKeeps`.
3. Explainer 2 (1939): `FourierMap`.
4. 1942–43: `KnownWave` (side), then `FourBumps`, computed from the 1947 paper's
   table 7.
5. Explainer 3 (1948): `PattersonMap`.
6. 1953: heavy atom (slim side), then `KnownWave known="mercury" brief` (slim side).
7. Hodgkin, 1954: `TwoChoices`.
8. 1957: `SheetStack`.

Parked: a rework of the Patterson figure; a small crystal "locator" for the four
bumps (an edge-on slab inset was rejected); a mirror-image ghost panel for
`TwoChoices`; Crick's rod-height comparison.

The plan of record is the author's doc "Hemoglobin essay — prioritized figure
list". Its first set, in build order: same height/different offset together
with the known-wave arrows, then the Fourier build-up, then the Patterson map
and the two candidate phases, then a title for `SheetStack`. Its hemoglobin-in-3D
figure is dropped: the essay will link to the Science Museum's models instead.
The second and third sets wait for the essay pass.

Quote fixes, fact checks and prose ideas found while mining the papers go in
the author's running doc "First structures: prose and quote improvements"
(https://claude.ai/code/artifact/bc1bb713-3e1c-4857-b76a-1b887c7c7367), not
into the essay. The author goes through it later.

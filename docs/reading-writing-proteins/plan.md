# Reading and Writing Proteins: design plan

The working plan for building the series in this repo, starting with piece 1.
The series plan doc (claude.ai, "Reading and Writing Proteins: series plan")
holds the scope, the five pieces and part two. This file covers how the pieces
look, behave and get built here. Facts and page references are in
[`sources.md`](sources.md).

## Where things stand

- Branch `series/reading-writing-proteins`, cut from `main`. It shares nothing
  with `essays/first-structures`; reconcile later (see "Reconciling with
  first-structures" below).
- Scaffolded: the series landing page (`/series/reading-writing-proteins`), a
  piece 1 skeleton (`/related`) whose headings are the beats below, a catalogue
  row, and a `pair-grid` cover motif with its social card.
- Nothing is built yet. The three claude.ai prototypes and `globins.json` were
  read for their logic and numbers and are deliberately not in the repo.
- The papers live on Nehal's Mac, which this cloud session cannot reach, and
  the open copies (Duke, PNAS) are blocked by the session's network policy.
  Until they are uploaded to a session, every fact in `sources.md` rests on the
  handoff's page references.

## What the prototypes taught, and what changes

The prototypes proved the step order. Their logic carries over; their
interaction and look get redesigned.

### Gap game (01)

**Keep:** the seven-step arc (slide, one slide isn't enough, free gaps cheat,
the penalty, a related pair survives it, real globins, real globins with free
gaps), the scoring rule (internal gap runs cost *p* each, end gaps free), and
the win messages, which are good first drafts of the prose that follows each
step.

**Change:**

- **Drag instead of click.** In the prototype, clicking a letter inserts a gap
  before it. In the new strip, the reader grabs any residue and pulls it right:
  it and everything after it move, and a gap opens behind it. Pulling it back
  closes the gap. The gesture itself teaches that a gap shifts everything after
  it and leaves everything before it in place, and pulling the first residue is
  the same gesture as a slide.
- **Rungs instead of filled tiles.** An identical pair gets a short vertical
  line joining the two letters. Mismatches get nothing. The rung is the same
  mark that becomes a dot when the strips fold into the grid later, so the
  reader learns one symbol for "these two residues are paired and identical".
- **One score line instead of four stat boxes.** `6 matches − 1 gap × 1 = 5`,
  in mono, updated live, with the target as a faint tick after it. Seeing
  how the score is made up is what the steps teach, so the sum stays visible.
- **Steps live in the prose.** The prototype's level picker becomes a sequence
  of figures down the page, each placed where its rule is introduced. A figure
  can carry two or three variants (Figure with a variant toggle) where one rule
  is tried on several pairs.

### Strips and grid (02)

**Keep:** `pairsOf`, which walks the alignment columns and returns the paired
cells. It is the bridge between strip and grid.

**Change:** the strips and the grid become one figure with a transition. The
top strip lifts to the top edge, the bottom strip swings round to the left
edge, and each rung drops into its cell as a dot. The reader watches a column
become a cell. Editing then works both ways: drag the strips and the path
moves, or drag the path in the grid and the strips update.

### Dot plot (03)

**Keep:** the window and threshold filter, the shuffle toggle, and the numbers
(1,533 dots for the real pair and for every shuffle at window 1; 21 hits near
the main diagonal at w=20, t=7 against about 5.5 for shuffles).

**Change:** sliders on one canvas become a lineup. Nine small dot plots sit in
a grid: one is real β against myoglobin, eight are shuffles of β against
myoglobin. At raw settings the reader cannot tell which is real, because the
dot count depends only on composition. Turning the window up makes the real
one show its diagonal. This turns a statistic into something the reader
experiences, and it sets up the shuffle test before the reader knows its name.

The window filter is a later refinement, probably Maizel and Lenk (1981) or
Staden (1982); it is not in Gibbs and McIntyre. The figure presents it as a
lens added afterwards, and the attribution stays marked ⚠ until checked.

## Design language

Everything follows CLAUDE.md. These are the series' own additions.

### Colour

A series `palette.ts` holds every figure colour. Proposed roles:

| Role | Colour | Used for |
|---|---|---|
| Residue | `ink-900` | letters in strips and grid labels |
| Pairing and structure | indigo (`#4F46E5` family) | rungs, dots, the path, diagonal steps |
| Gap | amber (`#B57E1F`) | the stretched thread in a strip, jump segments in the grid, gap cost in the score line |
| Chance | `ink-300` | shuffled sequences, the null histogram |
| Focus | red (`#E11D48`) | exactly one thing per figure: the current cell in the step player, the real score on the histogram, the cell the reader is filling |

Property colouring of residues (hydrophobic, charged, polar) stays off in piece
1 so identity is the only signal. Piece 2 turns it on.

### Type and layout

- Residues in `font-mono`, labels in `font-mono` small caps, captions and
  standfirst in `font-ui`, prose in `font-body`.
- Figures sit on the paper with no fill or frame, per CLAUDE.md. The
  first-structures branch puts its figures on a tinted card instead; that is a
  decision to make once, for both pieces, and is not adopted here yet.
- Each sequence row is labelled with protein and species
  (`β-hemoglobin · human`, `myoglobin · sperm whale`).
- Motion is short (under 300 ms), and every animated transition has a
  reduced-motion fallback that jumps to the end state.

### Mobile

- At 375 px with 16 px gutters a strip holds 12 residues at 24 px each.
- A real globin fragment needs about 20 residues to teach anything. At phone
  length (10 to 12 residues) the best β/myoglobin fragments score 3 for the
  best slide and 4 with one gap, which is too close to chance to make the
  point. So the real-globin strip scrolls horizontally inside the figure on
  small screens, and the toy pairs stay at 12 residues or fewer.
- Full-length grids (146 × 153) show an overview with a draggable focus window
  that opens a 24 × 24 detail.

### Accessibility

Strips are keyboard-operable: arrow keys move focus along a row, a key pushes
the focused residue right (opening a gap) or pulls it back. The score line is
an `aria-live` region. Every figure has a text summary of its current state.

### Following along with the papers

Start with margin notes (option A in the handoff). A `PaperNote` component sits
in the right margin on wide screens and collapses inline on narrow ones. Each
holds a short quote, a page reference, and one line on what the authors did
differently from the modern version. Notes are data (`quote`, `cite`,
`differs`), so a fuller "paper track" (option B) can be built from the same
records later. The Needleman–Wunsch figure gets a 1970 / modern toggle of its
own, which is option B in miniature.

## Code layout

```
pages/series/reading-writing-proteins/
  index.page.tsx          series landing
  meta.ts
  related/                piece 1
    index.page.mdx
    meta.ts
  figures/                shared across the series' pieces
    index.ts              the public surface; pieces import only from here
    palette.ts
    strip/                StripPair, ScoreLine
    grid/                 PairGrid (SVG up to ~40 residues, canvas above)
    player/               StepPlayer, useStepper
    chance/               NullHistogram, Lineup
    PaperNote.tsx
    related/              piece 1's own figures, composed from the above
  core/                   pure TypeScript, no React
    globins.ts            sequences with UniProt accessions
    alignment.ts          gapped rows, pairsOf, gap runs, scoring
    nw1970.ts             step generator for the 1970 algorithm
    nw.ts                 step generator for the modern recurrence
    shuffle.ts            seeded RNG, Fisher–Yates, null distribution, X
    count.ts              number of alignments (BigInt)
    dotplot.ts            raw and windowed hits
```

Notes on the layout:

- The series folder is the piece in CLAUDE.md's sense, so its `figures/` is
  private to the series and shared by its parts. If a primitive proves useful
  outside the series it moves to `viz/`.
- Aligners are step generators: each yields `{ cell, value, from, why }`, and
  the step player renders whatever it is given. The same player serves
  Smith–Waterman and progressive alignment later.
- All randomness is seeded, so a shuffle figure shows the same histogram on
  every load and the article-export screenshots are reproducible.
- `core/` gets a small script that prints the numbers piece 1 quotes, so a
  change to an algorithm that moves a quoted number shows up immediately.

## Piece 1, beat by beat

Each beat follows the pattern: try it by hand, hit the limit, get one rule, try
again, then a short panel citing the paper.

| # | The reader | The limit | The rule or idea | Paper note |
|---|---|---|---|---|
| 1 | Sees myoglobin and β-hemoglobin side by side: one fold, about 25% identical sequence | Does the sequence prove they are related? | The question of the piece | Zuckerkandl & Pauling; Strasser on the shift from function to evolution |
| 2 | Slides one strip along the other (GKVHL / KVHLT); each offset tried leaves a bar in a small chart below | A slide pairs everything with a new partner | Score = identical columns | — |
| 3 | Pulls a residue to open a gap (PLWKTEGH / PLWEGH) | The start and end want different slides | A gap shifts everything after it | N&W pathway rule, p. 444 |
| 4 | Uses free gaps on an unrelated pair and doubles its score | High counts by themselves prove nothing | Every gap costs 1 | "a barrier", p. 444 |
| 5 | Retries the related pair with the cost | Real gaps survive it | — | — |
| 6 | Aligns β 11–30 against myoglobin 10–31 with and without the cost (7 versus 11) | Free gaps inflate real data too | — | Gibbs & McIntyre's warning on repeats that "rely on the addition of gaps", p. 5 |
| 7 | Drags a length slider: 8,989 alignments at 6 × 6, about 2.6 × 10¹⁴ at 20 × 20, about 10¹¹³ for the full pair | No one can check them all | Braunitzer aligned by eye, with two gaps and 37 matches | "intuitive rationalization", p. 443 |
| 8 | Watches the strips fold into a grid, then drags the path | — | An alignment is a path; a slide picks a diagonal and a gap jumps between diagonals | — |
| 9 | Looks at raw dot plots; picks the real β/myoglobin plot from a lineup of shuffles, first raw, then with the window | Raw dots look like noise for distant relatives | Diagonal runs show shared stretches; windows show distant ones | Gibbs & McIntyre, p. 1; window attribution ⚠ |
| 10 | Fills the first cells of a small grid by hand, from the bottom-right corner, choosing the largest value in the sub-row and sub-column; then the step player finishes | Filling by hand is slow but each cell is easy | A cell remembers the best it can do | N&W Fig. 1 and 2, p. 445; backward from the C-terminus |
| 11 | Finds the maximum in the first row or column and traces back | — | The trace recovers the alignment | p. 446 |
| 12 | Turns on the penalty in the same grid and watches the path straighten | — | Subtract the penalty when the path leaves its diagonal | Table 1, p. 449 |
| 13 | Runs the full β/myoglobin grid with no penalty and with penalty 1 | 63 matches need 35 or more gaps; penalty 1 gives 38 | Compare with Braunitzer's 37 | p. 450 |
| 14 | Shuffles β and realigns: 10 times, as in 1970, then 1,000 | Is 38 more than chance? | X = (real − mean) / s, significant above 3 | p. 448; ribonuclease/lysozyme control, Table 2 |
| 15 | Switches between variable sets and sees the answer change | No set of weights is justified | The next piece's question | "no a priori best set", p. 452 |

### Should piece 1 split?

Fifteen beats is too many for one 20-minute read. The grid (beat 8) is a
natural split:

- **1a. Lining up** (beats 1 to 9): slides, gaps, the penalty, the explosion
  in possibilities, the grid and the dot plot.
- **1b. The best path** (beats 10 to 15): Needleman and Wunsch, the real
  numbers, the shuffle test and the limit.

The series plan already budgets piece 1 at two weeks, so this costs no extra
time and gives Asimov two pieces of normal length.

## Build order

1. `core/` and a script that reproduces the numbers. On today's UniProt
   sequences the 1970 algorithm gives 63 matches with free gaps (the paper's
   63) and 37 with penalty 1 (40 matches, 3 gaps), against the paper's 38
   (42 matches, 4 gaps). The difference comes from the 1960s sequences, which
   needs confirming against the paper's own sequence sources.
2. A lab page to play with each primitive on its own before the narrative
   settles (see decisions).
3. `StripPair` and `ScoreLine`, then beats 2 to 6.
4. `PairGrid` and the strip-to-grid transition, then beats 7 to 9.
5. `StepPlayer` and the 1970 step generator, then beats 10 to 13.
6. `NullHistogram`, then beats 14 and 15.
7. Prose, once the figures have been played with.

## Data still needed

- Ribonuclease and lysozyme sequences for the control (beat 14). Probably
  bovine RNase A (P61823) and hen egg-white lysozyme (P00698); check which N&W
  used ⚠.
- A close pair for the raw dot plot in beat 9: human against horse cytochrome
  c, or α against β hemoglobin (α/β already shows runs of 4 or more, 3 against
  0.6 for shuffles).
- The 1960s β-hemoglobin and myoglobin sequences N&W aligned, if the paper or
  Dayhoff's Atlas gives them, to reproduce 38 exactly.
- The letters in N&W Fig. 1 (OCR reads `ABCNJROCLCRPM` across and
  `AJCJNRCKCRBP` down, max match 8) ⚠.

## Reconciling with first-structures

The branches overlap in two shared files and one pattern:

- `ui/controls/Slider` gains `thumbLabel` and `valueText` on first-structures.
  If this series needs them, port the same change, so the merge is identical
  on both sides.
- `tailwind.config.js` gains `card` on first-structures. Leave it out here
  until the card-versus-paper decision is made.
- first-structures has `Figure` (with variants), `SliderRow`, `Note` and
  `Caption` in its own figures folder. Write this series' equivalents in its
  own folder, then promote whatever both pieces share into `viz/` once both
  have merged.
- `lib/content.ts` gets a row on each branch: a one-line merge.

## Decisions for Nehal

1. Split piece 1 into 1a and 1b?
2. A lab page: an unlisted `/series/reading-writing-proteins/lab` that shows
   each primitive with all its controls exposed, for playing before the
   narrative is fixed. It needs an `UNLISTED` entry in
   `scripts/check-content.mjs`.
3. Figures on the paper (CLAUDE.md today) or on a card (first-structures)?
4. The slug `related` for piece 1, and part slugs generally.
5. Upload the papers to a session (they can't be fetched from here) so
   facts can be checked against the PDFs.

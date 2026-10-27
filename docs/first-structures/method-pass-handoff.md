# Method figures in the essay: handoff (27 Oct 2026)

Picks up from `lab-handoff.md` (the five ideas, claims and budget). This pass
walked `pages/essays/first-structures/index.page.mdx` top to bottom, one stop at
a time, agreeing each figure with the author before building. Nothing is
committed.

## How the author wants to work (learned this pass)

- **One stop at a time, in words first.** Say what the reader must get, what's
  there now, and propose the simplest figure. Build only after an explicit yes
  to a specific described figure. Notes, sketches or inspiration images are
  context, not a go-ahead.
- **Check the idea against its claim before moving on.** A table: each step of
  the claim, what carries it (figure or prose), and what's still missing.
- **Diagrams only; never edit essay prose** in this pass, not even with `<Add>`.
  Text a figure needs goes in its panel notes, subtitle or caption.
- **Same visual language everywhere.** Reuse the essay's existing films, spots
  and crystal patches. Don't invent a new style for one figure. A drawn
  schematic doesn't have to be computed, but its perspective must be right.
- **Simplest form.** Two interactives in a row is too much; a second game was
  rejected for that reason.
- **Paper figures sit on the page**, not in the grey card: the `Plate`
  component in `figures/Figure.tsx` (title as a bold lead-in, then
  description, then source in small grey).
- Exaggeration is fine if the caption says so.

## Where each stop stands (after the clean-up pass, 27 Oct)

| Stop | Figure now |
|---|---|
| X-Rays | `TwoWaves` "How waves interact", shorter |
| Unit cell + "two kinds of information" | One figure, "Why a crystal makes spots" (`WhyBands`), placed after the "two kinds" paragraph: 1. two atoms make bands, 2. a whole crystal makes spots (`CrystalCancels`, spots baked into `crystal-spots.json`, two red rays), 3. the unit cell sets where the spots fall, 4. the molecule sets how dark they are (both `TwoKinds`) |
| The Big Idea (idea 2) | `LinedUp` "The film can't tell you how to line up the waves": flip game (note names the phase problem; one small status line under the meter), then right/wrong contour maps; no caption |
| Camera, 1947 layers | `Camera` (glass tube and photo a fifth smaller); layers `Plate` narrower, scan cropped above its 1947 caption |
| Salt (idea 3) | `SaltPair` "Salt tells you which way to flip each wave" (side float); `FourBumps` now a side float beside the "seven waves" paragraphs, "pure water" |
| Patterson | `PattersonRods` plate (renamed from `RodsEndOn`), a fifth narrower |
| Crick | figure removed; prose only |
| Mercury 1953 | `ReadingTheFilm group="atom"` float, "What mercury does to the spots", no caption |
| Hodgkin | `TwoHeavyAtoms` side float |
| 6 Å (idea 4) | none; left to prose |
| 1957–59 (idea 5) | `SheetStack` (click a laid-out slice to zoom; caption no longer claims "2.6×"), Kendrew model `Plate`, `PerutzModel` (smaller, no hover fade) |

Figure text follows the author's rule from this pass: very plain, short,
logical sentences, like the classroom Patterson paragraph. Panel headings
state what the panel shows. "unit cell", not "box". "protein's wave", not
"spot's wave".

## Code clean-up done

Deleted unused figures (kept in commit `9c1b156`): `CrystalFilms`,
`CrystalLattice`, `CrystalToFilm`, `FourierPhases`, `OneMoleculeScatters`,
`PhaseProblem`, `SpotRecords`, `TwoLayers`, `WavesAddUp`, `WavesToPicture`,
`WhatTheFilmKeeps`, `WhereAndHowDark`, `WhySpots`, `fundamentals`,
`oscillation.ts`, `SpotsToPicture`, `CrickRods`. `Note` moved into `Figure.tsx`;
`TwoAtoms` moved to `figures/lab/`; `LineUpGame` lost its salt mode;
`figures/index.ts` lists only what the essay uses. The lab page is kept and
still loads; every file only the lab uses now lives in `figures/lab/`, so
`figures/` holds just the essay's figures and their shared helpers.

## Checking

`npm run check`, then curl `/essays/first-structures` for a 500, then
screenshot each figure at 375 and 1024 px with headless Chrome. A small script
for that (`shoot.mjs`: pass a phrase from the figure's text and an output
prefix, plus optional tab labels to click) is in the shared notes folder for
this group of sessions. It needs to run outside the sandbox; if Chrome won't
start, change its debugging port.

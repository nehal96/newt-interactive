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

## Where each stop stands

| Stop | Figure now | State |
|---|---|---|
| X-Rays: "How waves interact" | `TwoWaves`, unchanged | agreed |
| "How atoms scatter x-rays" | `WhyBands` part 1 (two atoms, original marker) + new part 2 `CrystalCancels`: a 3D crystal and a square film, spots computed from the 1938 hemoglobin cell rocked 5° | agreed |
| "Two kinds of information" | `TwoKinds`: spacing pair (40/20 Å box) + molecule pair, from `ReadingTheFilm`. Replaced `CrystalRecords`; the 1937–38 box-size float was removed | agreed (idea 1 checked) |
| The Big Idea (idea 2) | `LinedUp`: part 1 `LineUpGame` (flip four waves, hidden atoms, "how close" meter, green on success); part 2 contour maps of the 7-atom molecule lined up right and wrong, atom rings on both | agreed (idea 2 checked) |
| Camera, 1947 layers drawing | unchanged (layers drawing is now a `Plate`) | untouched |
| Salt 1942–43 (idea 3) | `SaltPair` side float (in step: darker; opposed: fainter); `FourBumps` kept. Removed: liquid `KnownWave` float, `LiquidLayer` figure, a salt version of the game | agreed (idea 3 checked) |
| Patterson 1947–48 | One `Plate` (`RodsEndOn`): fig. 21 (map down the rods, peaks ringed) → fig. 22 (rods in 3D) → fig. 23b (his reading, end-on). Removed: `PattersonMap` three-atom figure, the test figure, separate fig. 23 plate | agreed |
| Crick | `CrickRods`, unchanged (matches Crick 1952 table 1) | agreed; relabel in clean-up |
| Mercury 1953 (idea 3 again) | `ReadingTheFilm group="atom"` slim float, heavy atom 2.4× two mercuries, caption says so. Removed: mercury `KnownWave` arrows float | agreed; idea 3 here is carried by this float + prose |
| Hodgkin, two derivatives | `TwoHeavyAtoms`: `SaltPair`'s rows carried one step on. Columns "If ahead" / "If behind" (a sixth of a wave either side of the mercury) darken the spot alike; a second heavy atom's wave makes one darker (matches the second film, green ring) and the other fainter. Side float in a `<Wrap>` beside the "path forward" and Dintzis paragraphs. Replaced `TwoChoices` (arrows) | agreed |
| 6 Å (idea 4) | none. "How more spots sharpen the map" (`FourierMap`) removed | agreed: left to prose. Gap noted: nothing says farther spots give finer waves |
| 1957–59 (idea 5) | `SheetStack` now right after the 1957 paragraph, Kendrew model `Plate` after "Pretty or not", then `PerutzModel` | agreed (idea 5 checked: slices → stack → model) |

## Next stops

The walk-through is done. Next is the clean-up pass below.

## Clean-up pass (after the walk-through)

Text in every new figure needs a proper writing pass (the author asked for
this). Known items: `WhyBands` caption and panel 1 heading still describe only
part 1; `TwoKinds` title repeats its panel headings; `FourBumps` says "tap
water" where prose says "pure water"; `CrickRods` title and bar labels;
`RodsEndOn` should be renamed; `CrystalCancels` caption should say spot
positions come from the 1938 cell and the crystal is rocked; `SheetStack`
leaves empty space above and below the slices when laid out, and its subtitle
could tie its contours to the ones in `LinedUp` part 2; `TwoHeavyAtoms` text.

## Files

- New and in use: `TwoHeavyAtoms`, `CrystalCancels`, `TwoKinds`, `LinedUp`, `LineUpGame`
  (its `salt` mode is unused), `SpotsToPicture` (only its helpers are used, by
  `LinedUp`), `SaltPair`, `RodsEndOn`, `Plate` in `Figure.tsx`, `XR.success`
  in `palette.ts`. `ReadingTheFilm` now exports `LAMBDA`, `EDGE_TAN`, `Atom`,
  `HEAVY_PAIR`; its heavy atom was raised to 0.6.
- New images: `public/images/first-structures/perutz-1949-fig21.png`,
  `perutz-1949-fig23a.png`, `perutz-1949-fig23b.png` (crops of the 1949 paper,
  `~/Downloads/research/literature/papers/Perutz_1949_…pdf`, PDF p. 13 for fig. 21).
- Unused, kept on disk: `WhySpots`, `CrystalFilms`, `WhereAndHowDark`,
  `CrystalRecords`, `PhaseProblem`, `SpotRecords`, `WavesToPicture`,
  `KnownWave`, `LiquidLayer`, `PattersonMap` (lab still uses `RodsTest`),
  `TwoChoices`, `FourierMap`.

## Checking

`npm run check`, then curl `/essays/first-structures` for a 500, then
screenshot each figure at 375 and 1024 px with headless Chrome. A small script
for that (`shoot.mjs`: pass a phrase from the figure's text and an output
prefix, plus optional tab labels to click) is in the shared notes folder for
this group of sessions. It needs to run outside the sandbox; if Chrome won't
start, change its debugging port.

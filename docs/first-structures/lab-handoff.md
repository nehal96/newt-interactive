# Method figures handoff (26 Oct 2026, evening)

For a fresh session taking the method figures (spots → electron density map)
into the essay itself. Read this, then `reading-guide.md`, then `figures.md`.

## How the author wants to work now

- **In the essay, start to finish.** Work in
  `pages/essays/first-structures/index.page.mdx`, in reading order, deciding
  each figure in place beside its paragraph. Not on the lab page, and not on
  side-by-side "options boards"; both were tried today and rejected.
- **Start every idea from the sources.** `reading-guide.md` maps each step to
  textbook and paper figures that already work (Rhodes is the one to read).
  Plain-text copies: `~/Downloads/research/literature/text/` (grep, never
  re-OCR). Today's session barely used them and kept reinventing pictures the
  books already have.
- **Simplest form that carries the claim.** Space is limited; the reader must
  understand the process, not every detail. Agree the logic in chat before
  building; a figure must read on first look.

## What the reader needs: five ideas (agreed)

| # | Claim | Pairs with |
|---|---|---|
| 1 | A molecule's own pattern shows through only at the spots: the crystal sets where spots fall, the molecule sets how dark they are. | X-Rays: "The spots on the film record two kinds of information…" |
| 2 | Add every spot's wave back together, each lined up right, and the molecule appears; the film records how strong each wave is, not how to line it up. | The Big Idea: "To work backward from the spots… next fifteen years" |
| 3 | Add something whose wave you can work out; whether each spot darkens or fades shows how its wave lines up. | 1943 salt ("Each spot now combined two waves…") and again 1953 mercury ("Over the following months, Perutz turned the two films into signs…") |
| 4 | Spots near the centre give the outline; spots farther out give finer detail. | "…a resolution of six ångströms…", paying off at 2 Å |
| 5 | The result is a stack of contour slices of electron density; the model is built inside it. | 1957 Kendrew sheets; 1959 Perutz model |

**Budget (agreed):** about four method figures. Ideas 1, 2, 4 one each; idea 3
reuses idea 2's figure with one more step (once at 1943, again at 1953); idea 5
is the existing paper figures. History in between (salt layer, four bumps,
Patterson rods, two heavy atoms): two or three figures at most, the rest prose.

The plain-words version of idea 2 that finally landed with the author: each
spot is one pattern of evenly spaced ripples through the molecule (direction
and spacing from where the spot is, strength from how dark); lay every spot's
ripples over the box, each slid to the right place, and add them at every
point; where they pile up there are electrons, so atoms. Contour the totals
slice by slice and stack the slices: that is the electron density map. The
slide is the phase, and the film doesn't record it.

## Author's verdicts from today

- **Liked / worked:** section 9 "why spots" (`CellTimesLattice`, already in the
  plan as a core essay interactive); `GuessAtom`; the line-up game's idea
  (flip waves, atoms hidden, film never changes) but "needs work" (clear goal,
  closer/further feedback); the heavy atom made visible as a source of the known
  wave; `SevenWaves` (real 1943 waves, with the film and its seven spots
  annotated) preferred over `FourBumps`, but too big for the final essay; the
  Patterson "test and result" framing (what the map was built to tell apart,
  then Perutz's real 1948 rods, fig. 22).
- **Rejected:** stripes as a derivation ("why is a spot stripes" too much for
  this audience); stacking pieces; the "focus" build-up; adding waves without
  flips as a Patterson explanation; the classroom redrawn as a figure (the text
  already does it); the `LiquidLayer` ringed-column film; options boards.
- **Needs a rethink, not reuse:** the essay's heavy-atom figures (arrows) and
  "How more spots sharpen the map".
- **Open questions the author raised:** whether the continuous phase (a slide,
  not a flip) must be shown, or only signs, as the essay's own order allows
  until the second heavy atom.

## Where things are

- Lab page `pages/essays/first-structures/lab.page.mdx` (dev only, 404 in
  production) now runs Acts I–III, sections 1–19, plus an options board at the
  end. Reference only. Figures in `figures/lab/`; rejected ones kept on disk.
- Small changes to essay figure files: `FourBumps.tsx` exports `REPEAT` and
  `PROTEIN`; `PattersonMap.tsx` gained a `RodsTest` export. The essay itself is
  unchanged.
- Nothing is committed.

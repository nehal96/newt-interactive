# First structures — length pass, handoff (17 Oct 2026)

Read this, then `~/Downloads/perutz-essay-codebase-handoff.md` (the claude.ai
project's brief: voice rules, term list, explanation chain, footnote tally).
The page is `pages/essays/first-structures/index.page.mdx`; it is the master
for the prose while this pass runs.

## Where it stands

Branch `essays/first-structures`, last commit `794eaf0`. **Uncommitted:** the
salt-solution plant, the shrinkage condense, the 1938 phase-problem cleanup,
the chymotrypsin merge into the Adair paragraph, and the parked
`SpotRecords` figure (placed, see below).

Body words (no headings, captions, figure text or footnotes):

| Section | Start (17 Oct) | Now | Change |
| --- | --- | --- | --- |
| Intro | 259 | 259 | 0 |
| X-Rays | 604 | 592 | −12 |
| The Big Idea | 1,084 | 954 | −130 |
| The Phase Problem | 1,513 | 1,334 | −179 |
| A Glimmer of Hope | 792 | 703 | −89 |
| Heavy Atoms | 2,164 | 1,955 | −209 |
| Success | 376 | 376 | 0 |
| **Total** | **6,792** | **6,173** | **−619** |

Target 5,500–5,600, plus room for the additions (intro opener, 1959 model
sentence, a couple of "what held / what didn't" lines; ~100–150). So roughly
**600–750 still to cut.**

## How the author wants to work (learned this session)

- One item at a time, shown as a `diff` with surrounding context, exact text
  moving, word counts, and usually two options plus a pick. Offer partial cuts.
- The author reads paragraphs as prose too: when a change spans a passage,
  show current and proposed side by side.
- **Stop nitpicking.** Sentence-level shaving removes natural language for a
  few words. Savings must come from removing whole beats and things said
  twice. Clarity edits only where a passage is actually unclear.
- Keep the author's connectives and quotes; avoid adding colons; keep the
  timeline readable (no jumps back without a "by then… had").
- Background goes to footnotes freely (they don't count), but footnotes should
  stay readable, not a dumping ground.
- Diagram ideas get prototyped before text is cut against them.

## Done (all approved item by item)

- Prose synced to the 17 Oct text; Fig. 22 caption updated.
- **Footnotes:** the 34 from the editors' BH-2 PDF restored and shown as
  **margin sidenotes** on ≥1280px (`figures/Sidenote.tsx`; hover notes below).
- Big Idea: chance encounter tightened; chymotrypsin → one sentence (now the
  end of the Adair paragraph), twinning in a note; money and immigration to
  notes; tribunal categories to a note; 1938 phase paragraphs cleaned for
  clarity (keeps "These phases were critical", "When aligned", "combine the
  waves mathematically").
- Phase Problem: capillary trimmed ("salt solution" now planted there);
  shrinkage condensed (keeps "the shrinkage was lopsided"); drying "two things
  at once" + pure-water crystals tightened; column paragraph keeps the goal
  ("To read the protein's wave… he first had to know the liquid's"); signs in
  two plain sentences; four sheets attributed to Perutz; Habakkuk details to
  the note; flat maps merged with the 1947 outline + why-flat clause; 3D map
  and "orderly" merged; contour-line sentence cut.
- Glimmer: chain-fitting compressed ("the Patterson was the only road left"
  kept; Bragg's "ill-planned and abortive" moved into its note); Crick
  tightened ("He concluded that the chains could not…; they could run…");
  Geiger paragraph keeps "grading them by eye"; "rather modest" blended;
  last sentence opens "Yet".
- Heavy Atoms: doubled cell shortened in text with two notes (what went wrong
  in 1954, the pH cause in 1957 — split so the note isn't a spoiler); mercury
  signs → callback to 1943; 1954 flat map and Hodgkin no longer lean on the
  cut "axis" sentence; Dintzis tightened (keeps "systematically"); Kendrew's
  turn says what 6 Å resolution means and keeps his own two-week estimate;
  Cullis trimmed. Kendrew's crystals paragraph kept as written.

### Footnote rows changed vs BH-2 (for the claude.ai tally)

37 notes now. Changes:
- **#4** (glacier summers) now opens "To make matters worse, his parents would
  no longer be able to fund his Cambridge education." Anchored on "refugee".
- **#7 + #8 merged** on "secured a grant…research": "The position also let
  Perutz support his parents and bring them to England; they had fled from
  Prague to Switzerland after Czechoslovakia came under German pressure."
  (Grant amounts removed at the author's request; "from Prague" is an
  inference from the body — check.)
- **New**, on the tribunal sentence: "Tribunals classified German and Austrian
  nationals as security risks, doubtful cases, or refugees from Nazi
  oppression."
- **#13** (Habakkuk) now opens "The project, Habakkuk, was to build an
  aircraft carrier out of wood-pulp-reinforced ice."
- **New**, on chymotrypsin: the Rockefeller origin and the twinning sentences.
- **#16** (Barcroft) placed on Kendrew's arrival; **#32** (Rockefeller
  sequencing) on "followed one amino acid at a time".
- **#20** now holds Bragg's "ill-planned and abortive" sentence plus the
  citation, on the alpha-helix sentence.
- **New** (1954): "The unit cell came out with one of its edges twice as long
  as before." **New** (1957): "Hemoglobin could pack into two different
  crystal lattices, and the switch between them depended on the acidity;
  Perutz had been growing his crystals at almost exactly the point where it
  flipped." (From draft 2 / Judson.)

`git diff 5e4d626 -- pages/essays/first-structures/index.page.mdx` has every
prose change for pasting back.

## Parked (decided to revisit, not rejected)

- **Move 3 — skip the flat Patterson maps** (~−93). Time-anchored draft, ready
  to apply: after the classroom, "A Patterson map is built the same way: …
  the taller the peak grows. Perutz’s first maps were flat, and after three
  years they showed only the molecule’s outline.[fn] What he needed was a map
  in three dimensions, a stack of slices through the crystal, one for each
  depth, which he called the only way to make the whole diffraction pattern
  “at least potentially capable of being interpreted.”" → the "orderly"
  paragraph (ending "…as further evidence of his stacked sheets.") → Patterson
  figure → Kendrew opening "By then, Perutz had a new partner… Early in 1946,
  Kendrew came back…" → 1948 measurement. Footnote: "These flat maps used the
  spots from a single view of the crystal, so the whole molecule was pressed
  onto one plane. In February 1947, Perutz published the outline they gave: a
  squat cylinder, 57 Å across and 34 Å high, “the fuzzy outline of the
  molecule.” Inside, thousands of atoms made millions of pairs, and their
  peaks piled into a tangle." Also change 1954 "flat, like Perutz’s Patterson
  maps of the 1940s" → "flat, the whole molecule pressed onto one plane".
- **`SpotRecords` — "What a spot records"** (new, waves only, no arrows, no
  steps): part 1 the film keeps height not crests; part 2 add a known wave,
  hidden protein wave in step or half out, reveal. Static + interactive,
  placed after the 1938 paragraphs. The author asked to leave it for now. Its
  purpose: make the defining idea land once so later passages (Bernal's
  heavy-atom idea, salt signs, 1948 isomorphous replacement, 1953 hinge,
  Hodgkin) can become short callbacks (~150–200 words).
- `WavesToPicture` ("How waves add up to a picture") — parked under it; the
  author found its earlier versions confusing.
- Kept as written on purpose: Bernal's drying lecture paragraph, Bernal's
  heavy-atom paragraph, the classroom analogy, the symposium sentence (the
  review was a separate piece — its link points to the symposium volume;
  check), Kendrew's crystals paragraph, the 1941–42 drying reasoning.

## What's left

Bigger, structural (where the remaining words are):
1. **Move 3** above (~−93).
2. **Weak spots stated once** — the 1953 hinge ("Their objection had been…")
   restates the 1948 numbers and the 1951 Geiger result; make it a callback
   (~−50).
3. **SpotRecords callbacks** once the figure is settled (~−150).
4. Riggs letter and darkroom paragraphs (unsourced "three floors").
5. X-Rays: rhodonite to a clause; Success P2 trims; the death sentence.
6. War and internment as one paragraph.

Then additions: intro opener (replaces "[why is it useful]", rewords the two
Lupas mentions), the 1959 model sentence (verify the cut-out detail in the
Nobel lecture), the 1957–59 ending given more room, resolution figure, the
trigger figure for Success.

Figures still to revamp after the text settles: salt/known-wave in the new
wave style, Patterson around the classroom, two-derivatives, resolution,
Kendrew stack zoom, Perutz's model (species in caption).

# Reading guide: the technical steps

Which chapters of the three textbooks, and which of the essay's papers, explain
each step of how the spots are made and read. Steps follow the walkthrough plan
(1–14). Page numbers are **PDF pages** unless marked "p." (printed).

## The books

| Short | File (in `~/Downloads`) | Printed p. → PDF | Text layer |
|---|---|---|---|
| **Rhodes** | `Rhodes_2006_Crystallography-Made-Crystal-Clear_3rd-ed.pdf` | +27 | yes |
| **Hammond** | `Hammond_2015_Basics-of-Crystallography-and-Diffraction_4th-ed.pdf` | +19 | yes |
| **Rupp** | `Rupp_2018_Biomolecular-Crystallography.pdf` | +23 | no (scan) |

- **Rhodes** is the one to read. Written for biologists, short, and built
  around the exact pictures this essay needs: Kevin Cowtan's computed
  "object → diffraction pattern" images, the duck/cat phase swap, and Harker
  circle diagrams with a fixed colour key. Chapters 2, 5 and 6 cover almost
  every step.
- **Hammond** is a physics/materials text. Mostly too general, but chapter 13
  has the best one-dimensional Fourier sum (NaCl) and W. L. Bragg's own 1929
  figure of "+/−" stripes adding into a map, plus a clean Patterson
  construction. Chapter 7 does diffraction with light and a net curtain.
- **Rupp** is the reference: rigorous, long, mathematical. Use it to check a
  claim, not to learn from. Its phasor ("scattering diagram") figures and the
  centric-reflection and Wilson-statistics sections are the parts worth
  opening.

## Step by step

### Part 1 — How a crystal makes spots

**1. Waves, and adding them up**
- Rhodes §2.6.1–2.6.2, PDF 48–51. Fig. 2.14: four waves showing amplitude,
  frequency and phase separately. Fig. 2.16: a square wave built from three
  cosines; the simplest "adding waves makes a shape" picture.
- Rhodes §6.2.2, PDF 139–142. Fig. 6.3: a wave as an arrow whose length is the
  amplitude and whose angle is the phase. Fig. 6.5: atoms' arrows added head to
  tail. **This arrow picture is the one notation that carries from step 1
  to step 13**; worth adopting early.
- Hammond §9.2, PDF 233–240. Fig. 9.3: the same arrow sum, one more drawing.

**2. Why it takes a crystal**
- Rhodes §2.4.1–2.4.3, PDF 42–44. One sphere gives a smooth blur; a lattice of
  spheres gives spots whose brightness traces that blur ("blur your eyes and
  you see the sphere").
- Rupp ch. 6.1, PDF 275–292: Fig. 6-4 adds two waves graphically (in step,
  half a cycle apart); Fig. 6-16 onward goes from one molecule's scattering to a
  crystal's.

**3. Where spots fall**
- Rhodes §2.4.2, PDF 43: spot spacing is inverse to cell spacing (the
  "reciprocal lattice"), shown by a lattice squashed one way giving a pattern
  squashed the other.
- Rhodes §4.2.3, PDF 82–84: Bragg's law, Fig. 4.8.
- Hammond ch. 7, PDF 191–216: diffraction of light. Fig. 7.1 is a laser through
  a net curtain (a reader can reproduce it); Fig. 7.3 is apertures vs.
  their patterns; Fig. 7.17 is a **twinned net** and its doubled pattern
  (footnote 1, chymotrypsin).

**4. How dark the spots are**
- Rhodes §2.4.3–2.4.4, PDF 44–45, Figs. 2.9–2.11: the same lattice holding a
  sphere vs. a hexagon. **Same spot positions, different darknesses.** This is
  the essay's "two kinds of information" paragraph in one image pair.
- Rhodes §2.6.3, PDF 51, Fig. 2.17: every atom contributes to every spot.

**5. What the film loses**
- Rhodes ch. 6 opening, PDF 137, **Fig. 6.1: duck and cat.** The duck's
  intensities with the cat's phases give back a cat. The standard
  demonstration that phases carry the picture.
- Rhodes §5.4.1, PDF 128–130, **Fig. 5.3**: each spot is one striped wave across
  the cell; sum the stripes and the molecule appears. Pairs with your
  `FourierMap`.
- Rhodes §2.6.5–2.6.6 / Fig. 2.19, PDF 54–56: an object's transform with phase
  shown as colour.
- Hammond §13.3.1, PDF 358–359: trial and error, and why it fails for big
  molecules.

### Part 2 — What Perutz read without phases

**6. The 1938 results**
- Rhodes §4.2.7–4.2.8, PDF 92–98: unit-cell dimensions and symmetry from spot
  spacing and pattern symmetry.
- Rhodes §8.3, PDF 224: a worked example of getting molecules per cell from
  cell volume and density (footnote 2's arithmetic, run the other way), and
  the range for protein crystals: 30–78 % water.
- Rhodes §3.1.4, PDF 61: why wet crystals diffract and dried ones don't
  (Bernal and Crowfoot, 1934). This sets up drying.

### Part 3 — Changing the crystal

**7. The reference wave**
- Rhodes §6.3 opening, PDF 144: why adding an atom changes some spots and not
  others.

**8. Drying and shrinkage ("nodes and loops")**
- Rhodes §2.4.3, PDF 43–44, again. **Shrinking the cell moves the sampling
  points along the molecule's own continuous pattern.** That one sentence is
  the whole of nodes and loops; Rhodes's sphere/lattice pair is the picture to
  start from.
- Hammond §9.3, PDF 242–246, "reciprocal lattice points and nodes".
- Primary: Perutz 1942 (*Nature* 149) for the four stages and cell table;
  Boyes-Watson, Davidson & Perutz 1947, PDF 21–23 (pp. 103–105), where they
  state the sampling idea outright; **Bragg 1965, pp. 8–11, Figs. 6–10**, the
  clearest account, with the 1952 nodes-and-loops drawings and the later true
  transform beside them.

**9. The salt experiment, signs and the 1D line**
- Hammond §9.2, PDF 236, **Fig. 9.5**: with a centre of symmetry every atom
  has a mirror partner, their arrows cancel sideways, and the sum lies on a
  line: "+" or "−". This is the 2-fold-axis argument in one diagram.
- Rupp ch. 6, "Centric and phase restricted reflections", PDF 327–328,
  Fig. 6-40.
- Hammond §13.2, PDF 355, **Fig. 13.5**: a 1D Fourier synthesis through NaCl's
  layers. The same kind of graph as the 1943 four bumps.
- Hammond PDF 357, **Fig. 13.7**: W. L. Bragg's 1929 picture of four
  "+/−" stripe patterns summing into a map. Bragg's own visual, and the one
  closest to how the 1943 and 1954 sums were done.
- Primary: Boyes-Watson & Perutz 1943 (*Nature* 151, 714). Read it; see the
  note below on how the signs were actually found.

### Part 4 — Patterson maps

**10. A map of distances**
- Rhodes §6.3.3, PDF 151–153, **Fig. 6.12**: three atoms, their vectors slid to
  the origin.
- Hammond §13.3.2, PDF 359–364, Figs. 13.9–13.10: the same construction, then a
  real Patterson (azidopurine) with peaks labelled by atom pair.
- Rupp ch. 9, "Patterson function and Patterson maps", PDF 488–494.
- Primary: Boyes-Watson 1947 (2D Pattersons, pill-box); Perutz 1949 (3D
  Patterson, rods); **Crick 1952** (Acta Cryst. 5, 381): its abstract states the
  result: chains "not more than 20 Å at a stretch" (≈ 13 residues of α-helix,
  matching the essay's "about a dozen").

### Part 5 — Heavy atoms

**11. Why one mercury is enough**
- Rhodes §6.3 opening, PDF 144: "heavy-atom method" vs. "isomorphous
  replacement", the essay's footnote 20 distinction, stated plainly.
- Hammond §13.3.3, PDF 365–367, Fig. 13.11: one heavy atom's arrow among many
  light-atom arrows.
- Rupp ch. 7.10, "The Wilson distribution for a random atom model", PDF
  370–375 (Fig. 7-10). Many arrows pointing in random directions add to
  roughly √N, not N; this is *why* the electrons "mostly cancel".
- Primary: **Green, Ingram & Perutz 1954** (Haemoglobin IV), pp. 287–288. Wilson
  statistics predicted r.m.s. F ≈ 500 per molecule; measured only ≈ 300.
  Two mercuries change F by ≈ ±114 on average (F² 9 → 17 or 3.5 ×10⁴).
  Those are the numbers behind the essay's "few hundred".

**12. One derivative: signs, flat map**
- Rhodes §6.3.1–6.3.2, PDF 144–148. **Fig. 6.6**: real native vs. derivative
  photographs with pairs of spots that swap which is darker; the thing
  Perutz showed Bragg in the darkroom. Fig. 6.7: subtract the two patterns and
  you get the heavy atom's own pattern, which locates it.
- Rupp ch. 10, "Isomorphous differences", PDF 499–502 (Fig. 10-1: subtract the
  native crystal from the derivative and only the heavy atom is left);
  "Difference Patterson maps" and Harker sections, PDF 508–516. Sidebar 10-1
  (≈ PDF 500–505) is a short history of isomorphous replacement.
- Primary: Green et al. 1954 (difference Patterson → mercury position → signs
  for 87 of 94 spots); Bragg 1965 Fig. 11 (`paper-figures/06_…`);
  Bragg & Perutz 1954 (Haemoglobin VI) for the flat map
  (`paper-figures/07_…`).

**13. Two derivatives: phases in 3D**
- Rhodes §6.3.2, PDF 146–150, **Figs. 6.8–6.11: Harker diagrams.** One
  derivative → two circles → two crossing points (two possible phases); a
  second derivative → a third circle through only one of them. Fig. 6.11 shows
  circles that graze rather than cross (an uncertain phase). Colour key:
  protein green, heavy atom blue, derivative red. Your `TwoChoices` is this
  figure.
- Rupp ch. 10.4, "SIR phasing and SIR maps", PDF 524–527 (Fig. 10-14);
  "Solving phase ambiguity by MIR", PDF 529–531 (Fig. 10-17, the classical
  MIR case).
- Primary: **Harker 1956** (Acta Cryst. 9, 1): the three-circle construction,
  Fig. 1, and the origin/hand problem; the "ways round" of footnote 26.
  Bokhoven, Schoone & Bijvoet 1951 sketched it first (p. 279).

**14. From phases to a model**
- Rhodes Fig. 5.2, PDF 129: **spots near the centre are the coarse waves,
  spots at the edge the fine ones.** This is what "6 Å resolution" means and
  why Kendrew used only the inner few hundred spots.
- Hammond §13.2.1, PDF 356–358, Fig. 13.8: the same map at 1.5 Å vs. 0.8 Å.
- Rhodes §7.3, PDF 176 onward: what a first map looks like and how a model is
  built into it.
- Primary: Kendrew et al. 1958; Bodo et al. 1959 (the 6 Å synthesis, 16
  sections); Perutz et al. 1960; `paper-figures/08–11`.

## Notes against the draft (to check, not yet changed)

1. **How the 1943 signs were found.** The letter describes three filters in
   sequence: the drying curves left 3 uncertain nodes → 8 possible sign sets;
   the salt-free vs. salt comparison ruled out all but 2; size, density and
   the 2-fold axis ruled out the last wrong one. The draft says the salt test
   "told him which" (and footnote 8 credits drying with two of the seven).
2. **"Soaking salt back in a little at a time."** The 1943 letter compares two
   states: Hartree's salt-free crystals vs. the usual ammonium-sulphate ones.
   Varying the salt in steps is Bragg & Perutz 1952a ("External form", used
   for the molecule's outline). Worth checking which the sentence means.
3. **Nodes and loops did more than footnote 8 says.** Bragg 1965 and Green
   1954 both say the 1952 transform work was what made a *single* mercury
   derivative enough: where mercury's contribution fell near zero in one part
   of a loop, another part of the same loop gave the sign. Green et al. used a
   silver derivative and a second (acid-expanded) lattice as well.
4. **The 1949 Patterson's computer: the draft is right.** Bragg 1965 says
   "electronic computer", but Perutz 1949 itself says Hollerith punched-card
   machines at the Scientific Computing Service (E. Gittus), using Hey and
   Rogers Low's penicillin method: about 7,000 terms at each of 58,621 points.
   Don't take Bragg 1965 as the source for this.

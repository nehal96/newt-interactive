# Hemoglobin essay — content plan

> Transcribed from the notebook ("Hemoglobin essay exploration", Jun 8). This is
> the *narrative* source of truth — the order of ideas, the analogies, and what
> each footnote/sidebar carries. The companion docs cover the *rendering* side:
> [`hemoglobin-molstar-cinematic.md`](./hemoglobin-molstar-cinematic.md) (how we
> drive Mol\*) and [`hemoglobin-3d-animation-exploration.md`](./hemoglobin-3d-animation-exploration.md)
> (feasibility + API survey).
>
> "Candidate visual" notes are my annotations for the interactive build, kept
> separate from the transcribed prose so this stays a faithful record of the notes.

The premise from the top of the notebook: *the Mol\* experiment worked — we can
make custom molecular animations — so now design the interactive itself.*

The essay is four parts: **(1) Anatomy → (2) Catching oxygen → (3) Releasing
oxygen → (4) Cooperativity.** The intro prose already on the page (red-blood-cell
scale, "no GPS, yet every part gets the right amount", "grab *and* know when to
let go") leads into Part 1.

---

## 1. Anatomy of a hemoglobin molecule

**Beats (build from the inside out):**
- Start with a single **iron atom**, then show the **heme group** around it
  (introduce the parts worth naming).
- A 5-sided ring = a **pyrrole**. Four pyrrole rings arranged around the iron =
  a **porphyrin**. (Heme = porphyrin + the central Fe.)
- Then reveal there are **four** heme groups, each wrapped in a protein chain —
  **two alpha chains and two beta chains**.
- These four subunits are **tightly clasped together, but with enough room to
  shift and rotate against one another**.
- This all sets the context for the oxygen catch-and-release mechanism.

**Diagram notes (from the margin sketch):** a heme drawn as 4 pyrrole rings
(each a 5-sided ring, one N apex) meeting at a central Fe, with the propionate/
methyl/vinyl substituents radiating out. Labels: "pyrrole", "porphyrin", "iron".

**Candidate visuals:**
- Heme build-up (iron → pyrrole → porphyrin → full heme), labeled — a 2D
  schematic is the natural fit here.
- A reveal of the real four-subunit molecule (2× alpha, 2× beta), colored by
  chain — the real quaternary structure.

---

## 2. How hemoglobin catches oxygen

### Coordinate positions (the six bonds of iron)
- Iron can connect from **six sides**. **Four** are in the heme plane, bonded to
  the **nitrogens of the porphyrin** ring. **One points down**, bonded to the
  **proximal histidine** (an amino acid — "proximal" because it's near). The
  **only open spot points up** — that's where **oxygen** binds. (5 of the 6 are
  nitrogen bonds; the 6th is O₂.)

### The pull (the trigger)
- When O₂ docks, it **pulls the iron toward it**. Before binding, the iron sits
  **~0.5 Å behind the plane** of the heme. Oxygen pulls it **into the ring**.
- Because the iron is **tethered to the proximal histidine**, which is connected
  to the rest of the protein chain, **that chain gets tugged too**. This shift
  presses on the neighboring subunits, nudging them to open up and grab oxygen
  more easily. **The binding of one oxygen sends a mechanical signal to the rest
  of the protein.**

> **Footnote — high-spin / low-spin ("how does a tiny O₂ pull a huge iron?").**
> Can open with *"You might be wondering how a tiny oxygen molecule 'pulls' a huge
> iron."* On binding, the iron's spin state changes (high-spin → low-spin) and it
> **becomes smaller**, letting it slip into the plane.

### Sidebar — why does one O₂ make the next ones easier? (T → R switch)
*(Notes flag: the salt-bridge detail can be a footnote, but the **T→R switch is
important** and belongs in the main line.)*
- With no oxygen bound, hemoglobin is in a **tense (T) state** — quite rigid.
  What holds it rigid is a **network of salt bridges**: little electrostatic
  clasps between a positively charged amino-acid side chain and a negatively
  charged one nearby. A set of these clasps — mostly around the **tail ends of
  the chains and near the subunit joints** — keeps the empty molecule in its
  **low-appetite, tense state**. So the **first oxygen is the hardest to bind**
  (needs the most activation energy).
- Recall the two alpha + two beta chains. Each α pairs with a β to make an **αβ
  dimer**. **Within** each half the pieces barely move; **between** the two
  halves there's room for a particular **switch-like movement**. There are **two
  stable states**: the **tense (T)** state and the **relaxed (R)** state,
  separated by a **~15° rotation** of one half against the other. **No
  intermediate** — like a clicker pen or light switch, it sits fully in one
  position or the other.
- When the tug on the iron travels out through the chain, it **strains the clasps
  holding the T setting**. One oxygen usually isn't enough. But **past a
  threshold**, the two halves rotate 15°, the **T-state salt bridges snap open**,
  and the whole molecule **switches to R**.
- **Why the flip matters:** in **T**, the rigid surrounding structure actively
  **restrains the proximal histidine**, holding the iron back from sliding into
  the porphyrin plane — so an oxygen has to "fight" the protein to bind (**low
  affinity**). In **R**, that restraint is released, the iron moves freely, and
  binding is easy (**high affinity**). *The heme's willingness to grab oxygen is
  shaped by the structure around it.*
- **Positive feedback / cooperativity:** the early oxygens (say the first two)
  have the hardest job — they bind in the reluctant T state and **pay the
  energetic cost of flipping the switch to R**. Once flipped, the remaining
  oxygens bind the eager R state **essentially for free**. This working-together
  is **cooperativity**. *(Notes: good segue into the S-curve in Part 4.)*

### Why it doesn't rust (the partial bond)
*(Notes flag: the **coordinate bond + 120° lean** need to be set up somewhere
before this.)*
- The iron "grabs" oxygen — but iron + oxygen normally makes **iron oxide
  (rust)**. If hemoglobin rusted it couldn't deliver oxygen, and the nanomachine
  would fail like a rusted industrial machine. It doesn't, because **oxygen
  doesn't fully bond** with the iron: the iron **doesn't fully hand over its spare
  electron — it only leans it partway** toward the oxygen. The bound state is a
  **tense in-between that's easy to reverse**.

### The distal histidine (steadier + bodyguard)
- Oxygen binds at a **~120° lean**, steadied **from above** by another amino acid,
  the **distal histidine** ("distal" because it's farther away). It hovers over
  the O₂ and — like a **weak hydrogen bond / faint electrostatic tether** — holds
  it at a comfortable angle, keeping the arrangement **gentle and returnable**.
- **Bodyguard against carbon monoxide:** without the hovering protein, CO binds
  iron ~**20,000× more tightly** than O₂. But CO likes to bind **straight**, and
  the distal histidine forces it onto a **tilt**, weakening the connection. CO's
  advantage drops from **20,000× to ~200× (a 100× cut)** — still poisonous, but
  meaningfully blunted. Without it, sitting by a fire would be 100× worse.

**Decided flow & visuals (Jun 16).** The anatomy section now *introduces* the
proximal His ("the fifth of its six connections"), the distal His ("hovering just
above"), and the αβ dimers ("room to shift and rotate … matters enormously"). So
this section must **invoke, not re-introduce** them — the re-teaching paragraphs in
the notes above are redundant and should be trimmed to one-line callbacks. The
beats, each tagged with its medium:

1. **The open seat** — *prose only, no new diagram.* Recap iron's six bonds (four
   in-plane N + proximal His = five taken; one open seat up top = O₂), leaning on
   the anatomy porphyrin + proximal-His beats the reader just saw.
2. **The pull** — *Mol\* morph (the centerpiece; `heme-oxygenation-morph.pdb`).*
   Iron snaps from out-of-plane into the plane as O₂ docks, dragging the proximal
   His. Accuracy pass: the Fe–O–O bend corrected to ~120° (was ~150°), the distal
   His added to the carve (static, hovering), a **side-on camera** so the
   out-of-plane→in-plane snap actually reads, and the Fe–O coordinate bond + the
   distal-His···O₂ H-bond drawn as viewer-layer measurements at the docked state.
   - Footnote: high-spin → low-spin ("how does a tiny O₂ pull a huge iron?"). *Text.*
3. **Why one O₂ helps the next (T→R)** — *one static SVG + prose.* Both T and R
   drawn (the whole molecule / two halves), with a faded ghost or highlight showing
   the 15° rotation. **No interactivity.** Carries: salt-bridge clasps hold T; 15°
   clicker-pen flip to R; T restrains the proximal His (low affinity) vs R frees it
   (high affinity); positive feedback → cooperativity (segue to Part 4's S-curve).
   - Footnote: salt-bridge specifics. *Text.*
4. **Why it doesn't rust (the partial bond)** — *text only, no diagram.* Iron + O₂
   would normally make iron oxide (rust); hemoglobin doesn't, because the iron only
   *leans* its spare electron partway toward the O₂ rather than fully handing it
   over — a tense, reversible in-between. Sets up *why* the bond is gentle and the
   geometry is bent.
5. **The lean, steadied by the distal His** — *Mol\* close-up (morph end-state).*
   O₂ sits at its ~120° lean; the distal His hovers and steadies it with a weak
   H-bond — gentle and returnable.
6. **Distal His as CO bodyguard** — *text only.* CO wants to bind straight; the
   distal His forces a tilt; its edge drops from ~20,000× to ~200×.

Keep all of this in the main line for now; decide the footnote-vs-body split in a
later edit pass. The real Mol\* quaternary T→R rotation stays blocked on an R-state
asset (see the cross-cutting note below) — the static SVG stands in.

---

## 3. How hemoglobin releases oxygen

**How does it know when?** The molecule doesn't decide — the **conditions around
it** signal that oxygen is in demand and help pull it off hemoglobin.

- **Mechanically, release is mostly catching in reverse:** hemoglobin switches
  **R → T**, which holds oxygen **more loosely** and lets it leave to where it's
  needed (e.g., a tissue desperate for oxygen).
- **But what triggers the R → T switch?** (Think: unfastening the seatbelt after
  the journey.) Several effects:

  **CO₂ / acid (the Bohr effect).** Say you're doing squats and your quads are
  working hard. Active tissue produces **carbon dioxide**, which pours out and
  becomes **acid in the blood**. The extra **protons bind onto the ends of
  hemoglobin and turn them positive**, creating **extra salt bridges**. Acid, in
  other words, **adds clasps** and helps hemoglobin switch to **T**. So CO₂ — the
  waste signal of *using* oxygen — becomes the signal to **deliver more of it**.

  **2,3-BPG (2,3-bisphosphoglycerate).** A small molecule made by red blood
  cells. In the **T** state there's a **small cavity between the two halves**; in
  **R** the rotation squeezes that cavity shut. 2,3-BPG **wedges into the cavity
  and props it open**, keeping hemoglobin in **T** — like a **doorstop**. *(Notes:
  2,3-BPG sets the S-curve baseline.)*

  **Heat.** A **warm muscle** pushes the balance toward release.

> **Footnote — CO₂'s secondary role** as carbamate groups (direct binding to
> hemoglobin's N-termini, separate from the acid/Bohr pathway above).

**Decided flow & visuals (Jun 16).** Release is mechanically "catching in reverse"
(R → T), so it gets **no new 3D morph** — the Section-2 binding morph is already
two-way (the player scrubs both directions), and replaying it backward teaches
nothing fresh. The R → T mechanics are a one-line **callback**, not a new viewer.
The *new* material is the **regulation** — what tips the T↔R balance toward release —
and that's where the section spends its words. The beats, each tagged with its medium:

1. **How it knows when / R → T is the catch in reverse** — *prose only.* The molecule
   doesn't decide; the conditions do. Mechanically it's the catch run backward
   (iron eases out of the plane, grip loosens). Callback to the Section-2 morph, no
   new 3D.
2. **What triggers R → T** — *prose only.* Seatbelt-unfastening framing; the shared
   theme that each factor tips the switch toward T.
3. **CO₂ / acid (the Bohr effect)** — *prose, shares the companion diagram below.*
   Squats → CO₂ → acid → protons make chain ends positive → extra salt bridges. "Acid
   adds clasps," holding T.
4. **2,3-BPG (the doorstop)** — *prose, shares the companion diagram.* Small cavity
   between the halves in T, squeezed shut in R; 2,3-BPG wedges in and props it open.
5. **Heat** — *prose only, one line.* A warm muscle pushes toward release.
6. **Companion diagram** — *one static SVG in the Section-2 T↔R style.* The two αβ
   halves and the 15° switch, salt-bridge clasps holding T, with **acid's extra
   clasps** at the chain ends and the **2,3-BPG doorstop** in the central cavity
   layered on. All three release factors on one frame, placed *after* the prose
   introduces each so the figure reads as a summary. (Real Mol\* is asset-blocked:
   `public/structures` only has `2HHB` (deoxy/T) and morphs derived from it — no
   R-state structure and no BPG ligand — so an SVG is both the pragmatic and the
   clearer choice. Reuses the Section-2 §2-beat-3 T↔R diagram, still a placeholder.)
   - Footnote: CO₂'s secondary carbamate role (N-termini, separate from Bohr). *Text.*
7. **Segue to Section 4** — *prose only.* All four factors (acid, CO₂, 2,3-BPG, heat)
   share one measurable signature: they shift the whole O₂ curve. That hands off to
   the cooperativity section, where the curve and its shifts become an interactive.

**Where the factors actually pay off:** acid/CO₂/2,3-BPG/heat all manifest as the
**rightward shift of the O₂ dissociation curve**, which is Part 4. So the single
interactive that serves both sections is the **saturation curve in §4 driven by these
factors** — not a backwards morph here. Build §4 from the fuller notes (images 3–4)
first so that interactive is fully specced (see §4 below).

**Candidate visuals (superseded by the decided flow above):**
- ~~R → T as the reverse of the catching animation.~~ → dropped (redundant; morph is two-way).
- The 2,3-BPG doorstop → folded into the single companion T↔R diagram.

---

## 4. Cooperativity

*(Transcribed from notebook images 3–4 — previously this section was a stub; the
full curve walkthrough, the myoglobin comparison, P50, the numeric payoff, and the
left/right shifts were all in the notes but not captured here until now.)*

- In the catching section we showed how binding one oxygen makes the **remaining**
  oxygens bind more easily — a positive effect. Releasing is symmetric: releasing
  one makes the rest **easier to release** — also positive. This is
  **cooperativity**, and it's the key property the structure buys us: oxygen is
  **picked up quickly in oxygen-rich environments (lungs)** and **released quickly
  in oxygen-deficient ones (active muscle)**.
- You can graph it as **% of hemoglobin oxygenated (saturation, y)** vs **how much
  oxygen is around (partial pressure of O₂, mmHg, x)**.
- The curve is **sigmoidal (the "S shape")**, a direct result of cooperativity.
  At the **low end**, increasing pressure raises saturation **very slowly**. Past
  a **threshold** there's a **steep rise** — small pressure increases produce
  large saturation increases — before it **plateaus** near full saturation. (At
  high saturation it levels off because there are **fewer and fewer empty seats**
  for oxygen to take.)

### Why the S-shape (the mechanism behind the curve)
- The middle **steep rise is cooperativity made visible**. At the low end most
  hemoglobin sits in **T**. As they take on a little oxygen and **switch to R**,
  the next oxygens bind more easily — the **positive loop kicks in** — until few
  seats remain and it tapers off.
- A **one-seat carrier like myoglobin has no switch**, so its curve is a
  **hyperbola**: it grabs oxygen quickly and then **holds on**. *(Notes sketch:
  the Mb hyperbola drawn as a dashed curve sitting up and to the left of the Hb
  sigmoid.)*

### P50 and the left/right shift
- **Other factors — acid (Bohr), CO₂, 2,3-BPG, heat — shift the curve right**, to
  **lower affinity** (this is the §3 release story, seen on the curve).
- A clean way to read a shift is **P50: the pressure at which saturation is
  half-full**. For a **right-shifted** curve, **P50 moves to a higher pressure** —
  i.e. hemoglobin **lets go of its oxygen more easily** than normal, which is
  exactly what those §3 signals are for (higher demand for oxygen).
- The **myoglobin overlay** is also the place to compare the benefit of the
  switch: at **lung pressure** the two are effectively the **same saturation**;
  but at **hemoglobin's P50**, myoglobin **still holds most of its oxygen** (a good
  *storer*) while hemoglobin **has, by definition, given half away** (a good
  *deliverer*).

### Reading real pressures (the numeric payoff)
*(Illustrative numbers straight from the notes; real-world figures are close —
keep these for the story, they're round and clear.)*
- **Sea-level / lungs ≈ 95 mmHg → ~98% saturated.** Even at **60 mmHg** hemoglobin
  is still **~90%**, so you stay fine while **quite elevated** (an airplane cabin,
  altitude). *(Margin: more such examples would be good.)*
- **Resting tissue ≈ 40 mmHg → ~75%** — sitting right in the **steep drop**, so a
  small dip in pressure **releases a lot of oxygen**. An **oxygen-hungry active
  muscle ≈ 20 mmHg → ~30%**.
- **The payoff:** a **20 mmHg drop in the steep middle (40 → 20)** moves saturation
  **75% → 30% (~45 points delivered)**; the **same 20 mmHg drop up top (95 → 75)**
  is only a **~3-point** change. That's roughly **15× more oxygen delivered for the
  same pressure drop**, exactly where you want it. The curve shows the behavior of
  the molecule **as a whole**. *(Margin: a drop in pressure is **instant**; the
  Bohr/BPG **shifts take some time** — worth a note on the figure.)*

### Left-ward shift
- **Fetal hemoglobin** is **left-shifted** (higher affinity), so it **pulls oxygen
  off the mother's blood across the placenta**. *(Notes also start a "- β" bullet,
  left incomplete.)*

---

### Reuse — the systems-biology Hill chart is a near-exact fit
The O₂-saturation curve **is the Hill function** the systems-biology activator
graph already renders. We can lean on that whole stack (Victory + shared chart
styles), changing only the labels and parameters:

- **Same equation.** `getActivatorHillFunctionData` computes
  `y = β·xⁿ / (Kⁿ + xⁿ)` ([systems-biology/helpers.ts](../interactives/systems-biology/helpers.ts)).
  For saturation: **β = 100%** (max), **x = pO₂ (mmHg)**, **K = P50**, **n = Hill
  coefficient**. So: **hemoglobin ≈ {n: 2.8, P50: ~26}** (sigmoid),
  **myoglobin = {n: 1, P50: ~2.8}** (hyperbola).
- **P50 indicator already exists.** `ActivatorGraph`'s `showKIndicator` draws the
  dotted vertical + horizontal lines and the scatter dot at `(K, β/2)` — that *is*
  the **P50 marker** ([systems-biology/ActivatorGraph.tsx:145](../interactives/systems-biology/ActivatorGraph.tsx)).
- **Myoglobin overlay already exists.** `showNComparisonCurves` overlays secondary
  Hill curves (`SecondaryLine`, greyed, labeled, draw-on `animate`) — reuse for the
  **n = 1 myoglobin hyperbola** vs the **n ≈ 2.8 hemoglobin sigmoid**.
- **The right/left shift is just K.** Varying `K` (= P50) slides the curve
  right/left with Victory's `animate` — the **Bohr/CO₂/BPG/heat** right-shift and
  the **fetal** left-shift fall straight out of the §3 factors.
- **Controls + draw-on animation already there.** `Slider`/`Switch` from
  `components`, the `axisStyle`/`getDottedLineStyle`/`getGridLineStyle` shared
  styles, and Victory `animate.onLoad` for the curve drawing on.

**What's genuinely new to build (extensions, not from scratch):**
1. A `SaturationCurveChart` modeled on `ActivatorGraph` — relabeled axes
   (% saturation / mmHg), Hb defaults, domain x:[0,100] y:[0,100].
2. **Environment markers** at arbitrary x (lungs 95, resting 40, muscle 20) with a
   drop-line to the curve and a saturation read-out — a small generalization of the
   K-indicator (point at an arbitrary pO₂ instead of at K).
3. A **delivery read-out** between two pO₂ markers to land the **15×** payoff.

### Decided flow & visuals — proposed (medium-tagged)
Inline figures in the essay's flowing style (no `SlideDeck`); one reusable
`SaturationCurveChart` placed at a few beats with different options + a small
controls wrapper, mirroring how systems-biology reuses `ActivatorGraph`.

1. **The curve + why it's S-shaped** — *interactive chart.* Hb sigmoid draws on;
   an **n slider/toggle** morphs hyperbola (n=1) → sigmoid (n≈2.8) to show
   cooperativity *creating* the S (reuses `showNComparisonCurves`).
2. **Myoglobin: storer vs deliverer** — *same chart, Mb overlay + P50 marker.* At
   lung pressure both high; at Hb's P50 Mb still loaded, Hb half-emptied.
3. **Reading real pressures (the payoff)** — *annotated chart (decided: fixed
   markers, not draggable).* **Fixed** environment markers at 95 / 40 / 20 mmHg —
   drop-lines + saturation labels — with the **40→20 vs 95→75 delivery (≈15×)**
   called out. *(Note on the figure: pressure change is instant, shifts are slow.)*
   Can upgrade to a draggable pO₂ marker later if it's worth it.
4. **The shifts** — *same chart, animated.* **For now (easiest placeholder):** a
   single **"exercising muscle" toggle** (rest ↔ working) that bumps P50 right and
   animates the curve — one clean before/after tied to the §3 squats story.
   **Deferred:** whether to split it into separate stacking CO₂/acid · 2,3-BPG ·
   heat toggles — decide once the §4 prose is written and we can match the control
   to the words (per-factor shift magnitudes are otherwise arbitrary). Optional
   **fetal-Hb** left-shift toggle.

**Resolved design choices (Jun 16):**
- *(beat 3 interactivity)* **Fixed annotated markers**, not a draggable marker —
  matches the notebook sketch, simplest to build, upgradeable later.
- *(beat 4 control)* **Single "exercise" toggle** as the placeholder; the
  per-factor split is **deferred to the prose pass**.
- *(scope)* **Drafted (Jun 16).** §4 prose written from the notebook bullets
  (`cooperativity/CooperativitySection.tsx`, near-verbatim, in the author's voice
  pending an edit pass) and the chart built: `SaturationCurveChart.tsx` (the Hill
  curve, modeled on the systems-biology activator graph) + `CooperativityFigure.tsx`
  (one chart, four toggle buttons: myoglobin · P50 · tissue O₂ levels · exercising
  muscle). Wired into the page after `ReleaseSection`. The beat-3 numbers
  (95/40/20 → ~98/76/30%) come straight off the curve; **fixed markers** as decided.
  Open for the later story pass: button set/labels, whether the exercise shift
  splits into per-factor toggles, and the explicit 15× delivery call-out.

---

## Cross-cutting threads to keep coherent
- **T (tense, low-affinity) ↔ R (relaxed, high-affinity)** is the spine: it shows
  up in catching (Part 2), releasing (Part 3), and the S-curve (Part 4).
- **Salt bridges = clasps** is the recurring mechanical image (hold T; acid adds
  more; 2,3-BPG props the cavity).
- **Proximal histidine** = the lever the iron pulls on (catching). **Distal
  histidine** = the steadier/bodyguard (no-rust, anti-CO).
- Asset note: we currently only have the **deoxy/T** structure (`2HHB`) plus the
  one-pocket morph. An **R-state** structure (e.g. oxy-hemoglobin) would be needed
  to animate the real T→R quaternary rotation.

# Hemoglobin Interactive — 3D Animation Exploration

> Status: **exploration / pre-implementation**
> Last updated: 2026-05-29
> Goal: decide how to build the core 3D animation for the hemoglobin interactive
> essay — specifically the **tightening of the heme group as oxygen binds**.

## 1. What we want

The hemoglobin essay's centerpiece is a 3D animation. The priorities, in order:

1. **Good-looking molecular rendering** out of the box (not points/squares).
2. **High-fidelity animation control** — pick exactly what's shown, drive camera
   movements, sync to narration.
3. **Annotation layer** — labels, highlights, callouts tied to the tutorial steps.

The first conceptual test: can we show the heme group "tightening" as O₂ binds?
Biologically, this is the **deoxy (T / "tense") → oxy (R / "relaxed")** shift: in
deoxy-hemoglobin the heme is *domed* with the Fe pulled out of the porphyrin plane
toward the proximal histidine (His F8); when O₂ binds, the Fe drops **into** the
plane, the ring flattens, and that pull propagates into the global quaternary
change. That in-plane snap is the "tightening" we want to show.

## 2. Current state of the existing work

The real prototype lives on the **`hemoglobin-interactive`** remote branch (5
commits, all `temp:`/exploratory, **untouched since Sept 2024**). It branched off
an *old* `main` (before c1-ffl / systems-biology / article-dates landed), so it is
significantly stale and will need a rebase/merge pass.

What exists there:

- **Essay page** (`pages/essays/hemoglobin/index.tsx`) — furthest along; real intro
  prose ("The Story of Hemoglobin"), `ArticleContainer`/`Lede`/`Title`, drops in
  `<HemoglobinStructureTutorial />`. OG/Twitter meta still placeholder.
- **Tutorial interactive** (`interactives/essays/hemoglobin/HemoglobinStructureTutorial.tsx`)
  — scaffold only. New `NestedInteractiveContainer` layout (text + 3D canvas).
  Chrome is hardcoded: section `Select` fixed to "Intro", body literally
  `"example text"`, static `1 / 15` step counter, Reset `onClick` commented out.
  No step/state logic.
- **3D model — the unsolved problem.** Three competing attempts toggled by
  commenting imports:
  - `r3f-models/Hemoglobin.tsx` — Blender *Molecular Nodes* GLTF export (1VWT);
    known issue "materials not showing".
  - `r3f-models/Hemoglobin-pdb.tsx` / `-spacefill.tsx` — GLTF from downloaded PDB.
  - `interactives/essays/hemoglobin/HemoglobinModel.tsx` — runtime `PDBLoader`
    fetching `1VWT.pdb` from rcsb.org, rendered as `Points` + `LineSegments` (the
    "just squares" result).
  - ~47 MB of committed binary `.bin`/`.gltf` model assets in `public/`.

**Bottom line:** good intro copy, a static UI shell, and an unsolved 3D rendering
problem — stalled ~18 months.

## 3. Feasibility verdict (Mol\*)

We evaluated **Mol\*** (`molstar@5.9.0`) by installing it and reading the source.

1. **Can we use just the visuals and drop the rest?** — **Yes, cleanly.**
2. **Can we animate the heme tightening?** — **Yes.** The only real work is
   *generating* the morph; *playing* it is built in.

### 3a. Separating the renderer from the "website" UI

Mol\* is structured in two layers:

- `mol-plugin/context.js` → `PluginContext`: the pure engine (rendering, state,
  camera, animation). **No React.**
- `mol-plugin-ui/context.js` → the React UI (panels, controls — the heavy "website"
  feel).

Practical path (what the official `basic-wrapper` example does) — keep the engine,
switch the whole UI off:

```ts
spec: {
  ...DefaultPluginUISpec(),
  layout: { initial: { isExpanded: false, showControls: false } },
  components: { remoteState: 'none' },
}
```

That yields **just the canvas**, driven entirely from code. For zero UI dependency
you can drop to `Canvas3D` directly (more plumbing, little gain here).

**Footprint:**

- Prebuilt full viewer `molstar.js` = **4.7 MB minified (~1.3 MB gzipped)** — that's
  the *whole* app; a no-UI subset import is smaller.
- **Lazy-load it** (Next.js `dynamic(..., { ssr: false })`) so it never hits the
  initial bundle and only loads on the hemoglobin essay.
- Peer deps `react`/`react-dom >= 16.14` ✓ (project is on React 18). The scarier
  peers (`canvas`, `gl`, `@google-cloud/storage`, `jpeg-js`, `pngjs`) are **only for
  Node/headless server rendering** — not needed in the browser.
- It is its own WebGL engine, separate from the existing react-three-fiber scenes.
  That's the real cost — confined to this one interactive, the only place that
  actually needs molecular rendering.

You get for free the quality the hand-rolled attempt lacked: ambient occlusion,
outlines, proper ball-and-stick / cartoon / surface representations.

## 4. Animation architecture (the key decision)

**Two different things animate**, and they want different tools:

- **The atoms moving** (the heme tightening) → a *precomputed trajectory* (physics
  layer).
- **Camera, labels, highlights, fades** (the cinematic layer tied to narration) →
  *keyframes*.

### Building on top of Mol\* — three tiers

**Tier 1 — Declarative keyframes via MolViewSpec "Stories"** *(recommended)*
Mol\*'s newest system (source files stamped `Copyright 2025`:
`extensions/mvs/helpers/animation.js`, `tree/animation/animation-tree.js`). Describe
a sequence of **scenes** (snapshots) — each carries camera, visible components,
colors, labels/annotations — and Mol\* **interpolates between them with easing**
(uses `EasingFns`, `lerp`, `Quat`/`Vec3` slerp, frames at `frame_time_ms`). There's
an authoring app + docs (MolViewStories), used for PDB "Molecule of the Month"
stories. Maps directly onto "pick exactly what I want + camera moves + labels."
Advance the scene index from the React tutorial step.

**Tier 2 — Imperative manager calls** *(fine per-step control)*
Confirmed APIs in source:
- Camera: `plugin.managers.camera.focusLoci(loci, { durationMs })` — built-in smooth
  lerp/slerp (`mol-canvas3d/camera/transition.js`).
- Visibility/representation: `setSubtreeVisibility`, update rep params, overpaint.
- **Labels**: `plugin.managers.structure.measurement.addLabel / addDistance /
  addAngle / addOrientation`.
- **Highlights**: `plugin.managers.interactivity.lociHighlights.highlightOnly({ loci })`;
  persistent focus via `plugin.managers.structure.focus.setFromLoci`.
- Built-ins underneath: `AnimateStateSnapshots` (per-snapshot transition duration +
  style), experimental `AnimateStateInterpolation` (tweens transform params via each
  transformer's `interpolate`).

**Tier 3 — Custom geometry / 2D overlays**
MVS `primitives` extension (meshes, lines, labels, tooltips) for arrows/markers; for
richer 2D UI, project 3D→screen and render React/HTML labels over the canvas.

### The atomic morph itself

`AnimateModelIndex` plays a **multi-model trajectory frame-by-frame and does NOT
tween between frames** (`Math.floor(frameCount * phase)`). So the heme motion = a
**precomputed multi-model file** you supply, with the camera/labels layered on top.
Clean separation: *physics layer* (baked morph) + *cinematic layer* (Mol\* keyframes).

## 5. How the desktop tools do it (morph generation)

The important lesson: **don't naively linear-interpolate** — straight-line Cartesian
interpolation stretches bonds, shrinks domains, lets chains pass through each other
on large motions.

- **ChimeraX `morph`** → default **corkscrew**: rigid groups move along a circular
  arc perpendicular to a rotation axis + linearly along it (helical/screw path).
  Also cartesian-linear and internal-coordinate options.
- **PyMOL `morph`** → default **RigiMOL**: rigid-block decomposition + sculpting
  refinement; `linear` is the quick-but-distorted fallback.
- **Yale/Gerstein Morph Server** → adiabatic multi-step minimization.

They output frame-by-frame trajectories and keyframe camera/labels in their own
movie systems (PyMOL `mset`/`mview`, ChimeraX `movie`/`view`).

**Takeaway:** for the whole-molecule T→R quaternary shift, generate a corkscrew /
rigid-body morph offline. For the local heme close-up (small motion), even linear
interpolation looks fine — a small script could generate that one ourselves.

## 6. Library comparison

Ranked for our priorities (looks + high-fidelity animation control + labels/highlights):

| Library | Looks | Animation/camera | Labels & highlights | Notes |
|---|---|---|---|---|
| **Mol\*** | ★★★ (AO, outlines, all reps) | ★★★ (MVS keyframes, snapshots, trajectory, easing) | ★★★ first-class | Best overall for web. Cost: ~4.7 MB, 2nd WebGL engine. |
| **NGL** | ★★ | ★★ (camera anim, trajectory player, shapes) | ★★ | Mol\*'s predecessor, same lead dev. Lighter, less active. Fallback if bundle size dominates. |
| **3Dmol.js** | ★★ | ★ (frame stepping, camera) | ★ | Lightest, easiest embed, declarative. Simple interactives, not cinematic. |
| **three / r3f** | depends on you | ★★★ (you own it) | ★★★ (drei Html, raycast) | Best UI integration with existing interactives; must build/bake molecular geometry. |
| **Blender + Molecular Nodes** | ★★★★ | ★★★★ (offline) | ★★★ | Best-looking, full control — but **pre-rendered**, not interactive. (The old branch tried this — the `"MN Default"` material is a MN export.) |

Skip: LiteMol (deprecated → Mol\*), Miew, JSmol (old/slow), Speck (small molecules),
PV/GLmol (stale).

## 7. Recommendation

- **Engine: Mol\*, UI stripped** — best fit for the three priorities.
- **Architecture: split the layers**
  - *Cinematic layer* → MVS / snapshot keyframes (Tier 1), one scene per tutorial
    step, driving camera + labels + highlights with easing.
  - *Physics layer* → a morph trajectory baked offline in **ChimeraX (corkscrew)**
    for the T→R motion (and/or a small hand-rolled linear morph for the isolated
    heme close-up), loaded as a multi-model file.
- Integrate as a **client-only `<MolstarViewer>`** (lazy, `ssr: false`) dropped into
  the existing `HemoglobinStructureTutorial` shell.

## 8. Constraints & gotchas

- **RCSB is blocked** by this environment's network policy (`files.rcsb.org` → 403).
  **Vendor** the structure(s) and the baked morph into `/public` and load locally —
  do **not** fetch from rcsb.org at runtime (the old `PDBLoader` approach would break
  here regardless).
- Mol\* must be **client-only** in Next.js (`dynamic(..., { ssr: false })`) and needs
  its CSS imported.
- `molstar` is currently installed in `node_modules` for inspection only — **not**
  added to `package.json` yet (will add when we commit to building).

## 9. Open questions / next steps

- [ ] Source structures: which deoxy (T) and oxy (R) PDBs? (e.g. 2HHB deoxy / 1HHO
      oxy). Vendor into `/public`.
- [ ] Generate the morph: ChimeraX corkscrew for full molecule vs. small hand-rolled
      linear morph for the isolated heme pocket (heme + His F8 + O₂).
- [ ] Build the stripped `<MolstarViewer>` client component (PoC: load one heme,
      focus camera, play the morph) to prove the split end-to-end.
- [ ] Decide scene/keyframe boundaries and wire them to the tutorial step state.
- [ ] Decide fate of the ~47 MB of legacy binary assets on the old branch.

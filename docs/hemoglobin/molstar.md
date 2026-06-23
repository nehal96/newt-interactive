# Hemoglobin interactive — Mol\* engine, styles & cinematic techniques

> Reference for future sessions on the hemoglobin 3D figures. Captures the
> decisions, representation recipes, and gotchas that **aren't obvious from the
> code**. The code is the source of truth for *how* we call Mol\*; this doc is the
> *why* and the things that cost real time to (re)discover.
>
> Companion: [`essay-plan.md`](./essay-plan.md) (the narrative content plan).

This merges what used to be three notes — the feasibility study, the cinematic
playbook, and the styles reference. The shipped essay reads start-to-finish inline
(no scene-stepper); the live figures share one boot/look engine.

---

## Orientation — the live files

| File | Role |
|---|---|
| `interactives/essays/hemoglobin/molstar-engine.ts` | Shared engine. Boots a plugin (client-only), applies the "villin look" (`applyVillinLook`), and exposes the React mount hook the viewers build on. |
| `interactives/essays/hemoglobin/molstar-chrome.ts` | Viewport chrome: `VIEWPORT_CHROME_OFF`, the `AXES_GIZMO`, and the `onWith` helper for rebuilding full "on" param sets. |
| `interactives/essays/hemoglobin/boot-queue.ts` | A tiny FIFO semaphore (`acquireBootSlot`) that caps how many plugins boot at once, so a fast scroll past several viewers doesn't jank the main thread. |
| `interactives/essays/hemoglobin/Lazy3DFigure.tsx` | Shared lazy figure shell — wraps each viewer in `dynamic(..., { ssr: false })` + an in-viewport mount, with a "Loading 3D…" fallback. |
| `interactives/essays/hemoglobin/anatomy/MoleculeViewer.tsx` | Static anatomy-beat viewer. Loads one small structure and frames it per `beats.ts`. |
| `interactives/essays/hemoglobin/anatomy/beats.ts` | Per-beat config: which structure, camera framing, and emphasis (the iron spacefill, etc.). **Deliberately free of any Mol\* import** (lazy-boundary trap below). |
| `interactives/essays/hemoglobin/catching/MorphPlayer.tsx` | Plays a baked multi-model morph (trajectory scrub / palindrome loop). |
| `interactives/essays/hemoglobin/catching/MorphFigure.tsx` | The binding + lean morph figures; owns `BINDING_MORPH_URL` / `LEAN_MORPH_URL`. |
| `interactives/essays/hemoglobin/release/BohrFigure.tsx` | Reuses `MorphPlayer` for the Bohr salt-bridge morph (`BOHR_MORPH_URL`). |
| `public/structures/2HHB.pdb` | Full deoxy-hemoglobin (static, one model). |
| `public/structures/heme-oxygenation-morph*.pdb` | Baked deoxy→oxy morph of **one heme pocket** (chain-A heme + proximal His + O₂); `-distal-his` variant adds the distal His for the lean figure. |
| `scripts/generate_heme_morph.py`, `generate_bohr_morph.py`, `carve_anatomy_pdbs.py` | Regenerate the morphs / carve the anatomy structures from 2HHB. |

> The earlier **scene-stepper** (`MolstarViewer.tsx` + `HemoglobinStructureTutorial.tsx`
> + `scenes.ts`) was removed when the essay went inline. **Its full code is in git
> history — last present at commit `3564e0f`.** It loaded the whole protein plus the
> O₂ morph into one plugin and drove a cinematic layer from a `scene` prop; the
> reusable recipes from it are preserved below.

---

## Why Mol\* (the engine decision)

Ranked for our priorities — looks + high-fidelity animation/camera control +
labels/highlights:

| Library | Looks | Animation/camera | Labels & highlights | Notes |
|---|---|---|---|---|
| **Mol\*** | ★★★ (AO, outlines, all reps) | ★★★ (keyframes, snapshots, trajectory, easing) | ★★★ first-class | Best overall for web. Cost: ~4.7 MB, a 2nd WebGL engine. |
| NGL | ★★ | ★★ | ★★ | Mol\*'s predecessor, same lead dev. Lighter, less active. Fallback if bundle size dominates. |
| 3Dmol.js | ★★ | ★ | ★ | Lightest, declarative. Simple interactives, not cinematic. |
| three / r3f | depends | ★★★ (you own it) | ★★★ (drei `Html`, raycast) | Best UI integration, but you must build/bake the molecular geometry. |
| Blender + Molecular Nodes | ★★★★ | ★★★★ (offline) | ★★★ | Best-looking, full control — but **pre-rendered**, not interactive. |

**Decision: Mol\*, UI stripped**, integrated as client-only (`ssr: false`) viewers.
The physics (the deoxy→oxy motion) is a morph trajectory **baked offline** and
loaded as a multi-model file, not computed live.

---

## Architecture decisions (and why)

- **Imperative calls, not MolViewSpec "Stories".** MVS Stories is real and complete
  in 5.9.0, but `loadMVS` rebuilds its own state tree (discarding our hand-built
  component split + the villin look), it's tuned for linear playback, and it doesn't
  compose with the baked multi-model morph. So everything is direct manager/state
  calls. MVS stays a future option for a "play the whole story" auto-mode.

- **A static bulky protein + a tiny animated pocket.** The morph file is *just* the
  heme pocket on purpose. **Perf rule — never re-tessellate the whole protein per
  frame.** `AnimateModelIndex` rebuilds the structure + representations of whatever
  it animates every frame; animating the full protein (cartoon for ~570 res × 4
  chains) would tank FPS, animating the ~50-atom pocket is cheap.

- **Coordinate alignment (load-bearing).** Each morph was carved out of 2HHB's
  chain-A heme with coordinates preserved, so morph frame 0 sits *exactly* where
  chain A's heme is in the full protein. That's what lets a camera fly continuously
  from the whole molecule into the pocket — and why, when both are shown, the
  protein's own chain-A heme is hidden so it doesn't ghost over the solid morph.

- **Scenes as data + a generation guard.** Async transitions bump a counter
  (`sceneGenRef`) on each call and on unmount, and every `await` is followed by a
  staleness check, so rapid step changes (or unmount) can't interleave half-applied
  state or touch a disposed plugin.

---

## 1. The "villin look" (canvas post-processing)

Live in `molstar-engine.ts` → `applyVillinLook(plugin, { background?, fog? })`.
Warm near-white background, soft lighting, ambient occlusion, black outlines.
Applied once after boot, independent of the representation. Borrowed from
molstar.org's `villin-md.molx` snapshot.

| Prop | Value | Notes |
|---|---|---|
| `renderer.backgroundColor` | `0xffffff` (beats) / `0xfcfbf9` (overview) | warm near-white |
| `renderer.ambientIntensity` | `0.4` | |
| `renderer.interiorDarkening` | `0.5` | |
| `postprocessing.occlusion` | samples `32`, radius `5`, bias `0.8`, blurKernelSize `15` | the costly part at playback (see §5) |
| `postprocessing.outline` | scale `1`, threshold `0.33`, color `0x000000`, includeTransparent `true` | Goodsell-ish black edges |
| `cameraFog` (optional) | intensity `15` | depth cue for the overview; pass `fog` to `applyVillinLook` |
| `camera.helper.axes` | `AXES_GIZMO` | bottom-left orientation gizmo, the only chrome |

Build "on" param objects with `onWith(mapped, overrides)` (in `molstar-chrome.ts`) —
a partial params object drops nested sub-params and later crashes the render pass.

---

## 2. Representation style recipes

Each was a `StyleBuilder(plugin, structure, colorTheme)` that added one or more
representations. Helpers: `repProps(type, color, { typeParams, colorParams })`,
`addRep`, and `wholeStructure(layers)`.

**Hemoglobin (protein + heme)** — component-split so the heme can be focused/animated
independently:
- polymer → `cartoon`, `sizeFactor 0.2`; for `secondary-structure` theme add `colorParams { saturation: -1, lightness: 0 }`
- ligand (heme + others) → `ball-and-stick`, `element-symbol` (Fe orange, ring N blue)
- iron → `spacefill`, `element-symbol`, `sizeFactor 1.1` (fat sphere)

**Heme close-up (oxygenation)** — a lone His won't form a cartoon, so the whole
pocket is sticks:
- whole → `ball-and-stick`, `element-symbol`
- iron → `spacefill`, `element-symbol`, `sizeFactor 0.9`

**Villin (cartoon + halo)** — translucent cyan "cloud" over a cartoon (a parked
overview look; the cloud was tried then dropped for the simpler ribbon + heme view):
- cartoon, `sizeFactor 0.2`
- `HALO`: `gaussian-surface`, `uniform`, `alpha 0.1`, `sizeFactor 3`, `smoothness 1.5`, `radiusOffset 0.3`, `colorParams { value: 0x009ce0 }`

**Plain whole-structure styles** (one rep, driven by the color theme): `cartoon`,
`ball-and-stick`, `spacefill`, `molecular-surface`, `gaussian-surface`, `putty`,
and `surface halo only` (just the `HALO` layer).

**Color themes used:** `secondary-structure`, `chain-id`, `element-symbol`,
`residue-name`, `molecule-type`, `uniform`. (Mol\*'s `element-symbol` colors carbons
by chain-id, which is why chain-A carbons read teal-green — see `palette.ts`.)

---

## 3. Two structures, one shared coordinate frame

The protein (`2HHB.pdb`) and a morph (`heme-oxygenation-morph.pdb`) can load into the
**same plugin**. The morph pocket was carved from 2HHB's chain-A heme (`HEM A 142` +
`His A 87`) with positions preserved, so **morph frame 0 sits exactly where that heme
is in the full protein**. That lets the camera fly continuously from the whole
molecule down into the pocket, animating the same heme the cartoon wraps around. (When
both are shown, chain A's static heme is hidden so it doesn't ghost over the animated
pocket.)

---

## 4. Cinematic techniques (imperative Mol\* calls, verified against 5.9.0)

Things that are easy to get backwards or that drift between versions — confirmed
against the installed source.

- **`setSubtreeVisibility(state, ref, value)` → `value` is `isHidden`.** So `true` =
  **hide**, `false` = show. (Easy to invert.)
- **Selection → Loci** (camera target / label anchor):
  `StructureSelection.toLociWithSourceUnits(Script.getStructureSelection(expr, structure.data))`.
  Feed loci to `camera.focusLoci`, `measurement.addLabel`, `interactivity.lociHighlights`.
- **Camera fly-in:** `camera.focusLoci(loci, { durationMs: 1200, extraRadius: 10 })`;
  reset/frame-all with `camera.reset(undefined, 800)` (the `800` is the ease duration).
- **Find representation cells:** `StateSelection.Generators.ofType(SO, root)` walks the
  whole subtree (pre-order), finding reps whether direct children of a structure or
  nested under components. Filter by `cell.transform.params.type.name`
  (`"gaussian-surface"`, `"ball-and-stick"`, `"spacefill"`, …) to target one layer.
- **Alpha ghosting** (fade the protein to a ghost): set `type.params.alpha` on every
  `Molecule.Structure.Representation3D` cell under the structure ref.
- **Halo fade** (animate only the translucent halo, not the whole protein — from the
  parked cloud look): filter those cells to `type.name === "gaussian-surface"` and
  animate **`alphaFactor`**, *not* base `alpha` —
  `cell.obj.data.repr.setState({ alphaFactor })` then `plugin.canvas3d.requestDraw()`.
  `alphaFactor` is a multiplicative GPU uniform: it preserves each rep's baked alpha
  (cartoon `1`, halo `0.1`) and is cheap (no geometry rebuild), whereas driving base
  `alpha` via state updates clobbers baked translucency and re-commits per frame. Drive
  it with a `requestAnimationFrame` tween that bails on the generation guard and on
  unmount. (Gotcha: with hemes kept solid, chain A's static heme overlaps the morph
  pocket — hide just chain A's heme there. See §3.)
- **Hide/show by rep type:** walk the same cells and `setSubtreeVisibility` on the ones
  whose `type.name` matches (e.g. hide the protein's hemes but keep the cartoon).
- **Billboard label:** `measurement.addLabel(loci, { visualParams: { customText: "Fe²⁺ + O₂" } })`
  — `customText` goes through `visualParams`, *not* a top-level option. Keep the
  returned selection to delete on teardown.
- **`builder.to(ref).update(fn)` runs through immer `produce`** — mutating `old` in
  place is safe; passing a *partial object* **replaces** the params and drops nested
  sub-params (that's what `onWith` is for).
- **Trajectory scrub:** update the `model-from-trajectory` transform's `modelIndex`
  (0-based) — the same thing `AnimateModelIndex` does under the hood.
- **Looped playback:** `animation.play(AnimateModelIndex, { mode: { name: "palindrome" }, duration: { name: "fixed", params: { durationInS: 4 } } })`
  — tightens then relaxes the heme on a loop (a fair picture of reversible binding).

**Proven end-to-end in a real browser:** multi-structure load, selection→loci, camera
fly-in + reset, per-scene visibility toggling, opacity fades, custom-text labels +
teardown, trajectory playback + manual scrub, generation-guarded transitions.
**Available but not battle-tested in our code:** highlights / persistent focus,
distance/angle measurements, camera snapshot save/restore.

---

## 5. Workflow traps (these actually cost time)

- **Fast Refresh does not re-run the `[]`-deps mount effect.** Structures are loaded
  once in the mount effect; editing the protein *style* or the structure list looks
  like "nothing changed" under HMR. You need a **full reload** (Cmd+Shift+R) or a
  dev-server restart.
- **Headless / software GL cannot render Mol\*'s geometry.** Headless Chrome
  (SwiftShader) draws the gizmo and UI but **not** the instanced structure reps — the
  canvas comes back empty, with *zero* console errors. A clean headless screenshot
  proves "the plugin mounted," **not** "it renders." **Visual checks must happen in a
  real browser** (e.g. the Chrome extension).
- **RCSB is network-blocked** here (`files.rcsb.org` → 403). Vendor every structure
  into `/public` and load locally; never fetch at runtime.
- **Mol\* must be client-only.** Loaded via `dynamic(() => import(...), { ssr: false })`,
  needs its CSS imported, and `beats.ts` (the per-beat config) stays Mol\*-import-free
  so the shell can read it server-side without pulling the engine into the bundle.
- **Build with webpack, not Turbopack** (`next build --webpack`, wired in
  `package.json`). Next 16.2.6's Turbopack *production* build silently breaks the
  `dynamic(..., { ssr: false })` viewers — the lazy chunk is never fetched, so every
  viewer hangs on "Loading 3D…" with **zero console errors and zero failed requests**.
  `next dev` (also Turbopack) loads them fine, so it only bites a deployed / `next
  start` build — this was the "3D doesn't load on Vercel" bug. The webpack build then
  needs the `exportsPresence` relaxation in `next.config.js` (drei → three-mesh-bvh
  imports `BatchedMesh`, absent from the pinned `three@0.139.2`). To verify a
  *deployed* build renders, scroll a real (or SwiftShader) Chrome and count `canvas` /
  `.msp-plugin` nodes — headless-software GL still won't draw geometry.

---

## 6. Known perf caveat

Morph playback felt low-FPS (**never measured** — `TODO(perf)`). Likely culprits:
`AnimateModelIndex` rebuilds the morph structure every frame, and the whole canvas
re-renders through the costly villin post-processing (32-sample AO + outline) each
tick. Levers to explore, *measure first*: drop AO/outline quality during playback,
bake fewer morph frames, or limit per-frame re-render to the morph subtree.

---

## Running & verifying

- `npm run dev` → http://localhost:3000/essays/hemoglobin
- After editing styles/structures, **hard-refresh** (Fast Refresh trap above).
- For "does it render / look right," use a **real browser**, not headless.
- The installed Mol\* source under `node_modules/molstar/lib` is the ground truth, but
  it's pinned to 5.9.0 and not in git — prefer symbol names over line numbers when
  citing it, since lines drift.

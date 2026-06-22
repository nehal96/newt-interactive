# Mol\* styles & cinematic techniques — reference

> Status: **reference** (captured 2026-06-22). Salvaged from the removed
> scene-stepper viewer so the representation recipes and camera/animation
> techniques aren't lost. The shipped essay now reads start-to-finish inline and
> no longer uses a stepper.

The scene-stepper (`MolstarViewer.tsx` + `HemoglobinStructureTutorial.tsx` +
`scenes.ts`) was removed; it loaded the whole protein plus the O₂ morph into one
plugin and drove a cinematic layer from a `scene` prop. **Full code is in git
history — last present in commit `3564e0f` (and earlier) at
`interactives/essays/hemoglobin/MolstarViewer.tsx`.** This note keeps the
reusable pieces for future experimentation.

The live viewers (`anatomy/MoleculeViewer`, `catching/MorphPlayer`) and the
shared boot/look engine (`interactives/essays/hemoglobin/molstar-engine.ts`)
remain and are unaffected.

---

## 1. The "villin look" (canvas post-processing)

Still live in `molstar-engine.ts` → `applyVillinLook(plugin, { background?, fog? })`.
Warm near-white background, soft lighting, ambient occlusion, and black outlines.
Applied once after boot, independent of the representation.

| Prop | Value | Notes |
|---|---|---|
| `renderer.backgroundColor` | `0xffffff` (beats) / `0xfcfbf9` (overview) | warm near-white for the protein scene |
| `renderer.ambientIntensity` | `0.4` | |
| `renderer.interiorDarkening` | `0.5` | |
| `postprocessing.occlusion` | samples `32`, radius `5`, bias `0.8`, blurKernelSize `15` | the costly part at playback (see §5) |
| `postprocessing.outline` | scale `1`, threshold `0.33`, color `0x000000`, includeTransparent `true` | Goodsell-ish black edges |
| `cameraFog` (optional) | intensity `15` | depth cue for the overview; pass `fog` to `applyVillinLook` |
| `camera.helper.axes` | `AXES_GIZMO` | bottom-left orientation gizmo, the only chrome |

Build "on" param objects with `onWith(mapped, overrides)` (in `molstar-chrome.ts`)
— a partial params object drops nested sub-params and later crashes the render
pass.

---

## 2. Representation style recipes

Each was a `StyleBuilder(plugin, structure, colorTheme)` that added one or more
representations. Helpers: `repProps(type, color, { typeParams, colorParams })`,
`addRep`, and `wholeStructure(layers)` (apply N layers to the whole structure).

**Hemoglobin (protein + heme)** — component-split so the heme can be
focused/animated independently:
- polymer → `cartoon`, `sizeFactor 0.2`; for `secondary-structure` theme add `colorParams { saturation: -1, lightness: 0 }`
- ligand (heme + others) → `ball-and-stick`, `element-symbol` (Fe orange, ring N blue)
- iron → `spacefill`, `element-symbol`, `sizeFactor 1.1` (fat sphere)

**Heme close-up (oxygenation)** — a lone His won't form a cartoon, so the whole
pocket is sticks:
- whole → `ball-and-stick`, `element-symbol`
- iron → `spacefill`, `element-symbol`, `sizeFactor 0.9`

**Villin (cartoon + halo)** — translucent cyan "cloud" over a cartoon (the parked
overview look; see also `docs/experiments/villin-cloud-experiment.md`):
- cartoon, `sizeFactor 0.2`
- `HALO`: `gaussian-surface`, `uniform`, `alpha 0.1`, `sizeFactor 3`, `smoothness 1.5`, `radiusOffset 0.3`, `colorParams { value: 0x009ce0 }`

**Plain whole-structure styles** (one rep, driven by the color theme): `cartoon`,
`ball-and-stick`, `spacefill`, `molecular-surface`, `gaussian-surface`, `putty`,
and `surface halo only` (just the `HALO` layer).

**Color themes used:** `secondary-structure`, `chain-id`, `element-symbol`,
`residue-name`, `molecule-type`, `uniform`. (Mol\*'s `element-symbol` colors
carbons by chain-id, which is why chain-A carbons read teal-green — see
`palette.ts`.)

---

## 3. Two structures, one shared coordinate frame

The protein (`2HHB.pdb`) and the morph (`heme-oxygenation-morph.pdb`) were loaded
into the **same plugin**. The morph pocket was carved from 2HHB's chain-A heme
(`HEM A 142` + `His A 87`) with positions preserved, so **morph frame 0 sits
exactly where that heme is in the full protein**. That lets the camera fly
continuously from the whole molecule down into the pocket, animating the same
heme the cartoon wraps around. (On the binding scene, chain A's static heme is
hidden so it doesn't ghost over the solid animated pocket.)

---

## 4. Cinematic techniques (imperative Mol\* calls)

- **Fe selection → Loci** (camera target / label anchor):
  `StructureSelection.toLociWithSourceUnits(Script.getStructureSelection(IRON_EXPR, structure.data))`.
- **Camera fly-in:** `plugin.managers.camera.focusLoci(loci, { durationMs: 1200, extraRadius: 10 })`; reset with `camera.reset(undefined, 800)` (the `800` is the ease duration).
- **Alpha ghosting** (fade the protein to a ghost): select every
  `Molecule.Structure.Representation3D` cell under the structure ref and set
  `type.params.alpha` on each — works for both whole-structure and component-split
  styles (reps may be nested under polymer/ligand/iron components).
- **Hide/show by rep type:** walk the same Representation3D cells and
  `setSubtreeVisibility` on the ones whose `type.name` is `ball-and-stick` /
  `spacefill` (e.g. hide the protein's hemes but keep the cartoon).
- **Billboard label:** `plugin.managers.structure.measurement.addLabel(loci, { visualParams: { customText: "Fe²⁺ + O₂" } })`; remember the returned selection to delete on teardown.
- **Trajectory scrub:** update the model transform's `modelIndex`
  (`state.build().to(modelRef).update(old => { old.modelIndex = frame })`) — the
  same thing `AnimateModelIndex` does under the hood.
- **Looped playback:** `plugin.managers.animation.play(AnimateModelIndex, { mode: { name: "palindrome" }, duration: { name: "fixed", params: { durationInS: 4 } } })` — tightens then relaxes the heme on a loop (a fair picture of reversible binding).
- **Race guard:** a monotonically increasing `sceneGenRef`; each async scene
  transition bails as soon as a newer one starts (rapid Prev/Next).

---

## 5. Known perf caveat

Morph playback felt low-FPS (never measured). Likely culprits: `AnimateModelIndex`
rebuilds the morph structure every frame, and the whole canvas re-renders through
the costly villin post-processing (32-sample AO + outline) over the full protein
each tick. Options to explore: drop AO/outline quality during playback, bake
fewer morph frames, or limit re-render to the morph subtree.

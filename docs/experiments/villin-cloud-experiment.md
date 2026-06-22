# Parked experiment — villin "cloud" look for the hemoglobin overview

> Status: **parked** (2026-06-08). We went back to the ribbon + heme-group look
> for now; revisit this when we return to the overview scene's styling.

## What it was

An alternative look for the tutorial's overview scene, based on molstar.org's
[`villin-md.molx`](https://molstar.org/viewer/?snapshot-url=https%3A%2F%2Fmolstar.org%2Fdemos%2Fstates%2Fvillin-md.molx&snapshot-url-type=molx)
snapshot:

- **Style `"Hemoglobin (cloud + heme)"`** — a desaturated cartoon + the four heme
  groups (ball-and-stick) + their irons (spheres), all wrapped in a translucent
  cyan gaussian-surface **halo** (`alpha 0.1, color #009ce0`). Pairs with the
  existing `applyVillinLook` (ambient occlusion + outlines + warm background).
- **Animated cloud-only fade** — on the way into the binding scene, only the
  gaussian-surface halo fades to opacity 0 (the ribbons and hemes stay solid);
  it fades back in on the way out.

## Why parked

The look was good but we chose the simpler ribbon + heme-group view
(`"Hemoglobin (protein + heme)"`) for the slice while we nail down the
cinematics. The cloud is a styling choice we can swap back to later.

## Technical notes & how to restore

The cloud recipe (the `gaussian-surface` halo over a desaturated cartoon + hemes)
and the halo-only fade technique (filter to `gaussian-surface` cells; animate
`alphaFactor`, not base `alpha`; the rAF tween with a generation guard; the
chain-A heme overlap gotcha) are folded into the Mol\* reference —
[`../hemoglobin-molstar-styles.md`](../hemoglobin-molstar-styles.md), under
"Villin (cartoon + halo)" and the "Cloud / halo fade" technique.

There's no longer a reference patch: the scene-stepper `MolstarViewer.tsx` it
diffed against was removed, so it could no longer be `git apply`-ed. To rebuild
the cloud look, port the `hemoglobinCloudStyle` builder and the `fadeCloud` /
tween helpers from git history (last present in commit `3564e0f`) onto the
current viewers, following the styles doc.

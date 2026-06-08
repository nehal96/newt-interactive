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

## Technical notes worth keeping

- **Fade just the halo, not everything:** select `Representation3D` cells under
  the protein structure and filter to `transform.params.type.name ===
  "gaussian-surface"`. Fading *all* protein reps also dims the ribbons — which
  was the bug that made us narrow it.
- **Animate opacity with `alphaFactor`, not base `alpha`.** `alphaFactor` is a
  multiplicative factor set live via `cell.obj.data.repr.setState({ alphaFactor })`
  followed by `plugin.canvas3d.requestDraw()` (the same pattern Mol* uses
  internally). It preserves each rep's baked alpha (cartoon 1, halo 0.1) and is
  cheap (a GPU uniform, no geometry rebuild). Driving base `alpha` via state
  updates would clobber the halo's translucency and re-commit per frame.
- Use a `requestAnimationFrame` tween that bails on a generation guard (rapid
  Prev/Next) and on unmount.
- **Open question:** with the hemes kept solid, the protein's own chain-A heme
  overlaps the animated morph pocket on the binding scene (they're the same
  heme). If revisiting, hide just chain A's heme on that scene.

## How to restore

The full change (against the `76f7c6a`-era `MolstarViewer.tsx`) is saved as a
reference patch next to this file:

    docs/experiments/villin-cloud-MolstarViewer.patch

From a working tree whose `MolstarViewer.tsx` still matches that base:

    git apply docs/experiments/villin-cloud-MolstarViewer.patch

If the file has drifted, treat the patch as a reference and re-apply the pieces
by hand (the `hemoglobinCloudStyle` builder, the `cloudReprs`/`tween`/`fadeCloud`
helpers, the `cloudOpacityRef`, and the cloud variant of `applyScene`).

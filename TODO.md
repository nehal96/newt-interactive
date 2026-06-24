# TODO

## Make the hemoglobin parts manifest downloadable, and try a 3D LEGO style

The parts manifest (the components list opening the anatomy section) should be exportable as a downloadable file — a single image users can save, in the spirit of a LEGO instruction sheet. Separately, explore a 3D LEGO-style rendering of the parts (the angled, softly-lit gaussian-surface look) as an alternative to the current flat 2D ball-and-stick figures.

Files: [interactives/essays/hemoglobin/anatomy/PartsManifest.tsx](interactives/essays/hemoglobin/anatomy/PartsManifest.tsx), [interactives/essays/hemoglobin/anatomy/PartFigures.tsx](interactives/essays/hemoglobin/anatomy/PartFigures.tsx)

## Trim the Mol\* plugin spec for the anatomy viewers

Each anatomy beat boots a Mol\* plugin from `DefaultPluginUISpec()`, which registers global structure-analysis providers (accessible surface area, etc.). With several viewers on the page this floods the console with harmless `Symbol '…accessible-surface-area…' already added` warnings and adds avoidable work to every boot. The anatomy structures are tiny and static, so build a lean spec that drops the analysis/validation behaviours and animation/measurement managers we don't use — quieter console, faster boots. Verify the "villin look" (occlusion + outline + the iron emphasis) still renders identically. Related future lever once the full essay has many viewers: an LRU that `dispose()`s the least-recently-seen viewer past a context-count threshold (the lazy-mount + pause-offscreen plumbing in [use-in-viewport.ts](hooks/use-in-viewport.ts) is already shaped for it).

Files: [interactives/essays/hemoglobin/anatomy/MoleculeViewer.tsx](interactives/essays/hemoglobin/anatomy/MoleculeViewer.tsx), [interactives/essays/hemoglobin/boot-queue.ts](interactives/essays/hemoglobin/boot-queue.ts)

## Post-publish: share the project's work-in-progress material

After the hemoglobin essay ships, share the work-in-progress material for the whole project from my notebook.

// Public surface of the hemoglobin essay.
//
// The MDX page imports every figure (and the prose `Term`) from here, so the
// internal layout can change freely without touching the prose. The essay is
// organized by section, over a shared Mol* engine:
//
//   anatomy/        build-from-the-inside-out beats (iron → heme → tetramer)
//   catching/       the deoxy→oxy binding morph players
//   release/        the Bohr salt-bridge and 2,3-BPG doorstop figures
//   cooperativity/  the saturation-curve figures (shared SVG chart)
//   quaternary/     the T↔R quaternary-switch diagram
//
//   palette.ts      single source of truth for the essay's colors
//   molstar-engine.ts / molstar-chrome.ts / boot-queue.ts   shared 3D engine
//   Lazy3DFigure.tsx / Term.tsx   shared figure shell and prose-term helper
//
// See docs/hemoglobin/ for the content plan and the Mol* reference.

export { AnatomyBeatBlock, PartsManifest } from "./anatomy";
export {
  default as MorphFigure,
  BINDING_MORPH_URL,
  LEAN_MORPH_URL,
} from "./catching/MorphFigure";
export { default as TRSwitchFigure } from "./quaternary/TRSwitchFigure";
export { default as BpgDoorstopFigure } from "./release/BpgDoorstopFigure";
export { default as BohrFigure } from "./release/BohrFigure";
export { default as SaturationPopulationFigure } from "./cooperativity/SaturationPopulationFigure";
export { default as OperatingPointsFigure } from "./cooperativity/OperatingPointsFigure";
export { default as AffinityShiftFigure } from "./cooperativity/AffinityShiftFigure";
export { default as Term } from "./Term";

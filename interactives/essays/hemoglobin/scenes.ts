// Narration/metadata for the hemoglobin tutorial steps. Kept free of any Mol*
// imports so the tutorial shell can read it without pulling the (client-only,
// lazy-loaded) 3D engine into the server/initial bundle.
//
// The cinematic half of each scene — camera, fades, the trajectory, labels —
// lives in MolstarViewer's `applyScene`, indexed in lockstep with this array.
export type HemoglobinScene = {
  key: string;
  section: string;
  title: string;
  text: string;
};

export const HEMOGLOBIN_SCENES: HemoglobinScene[] = [
  {
    key: "overview",
    section: "Intro",
    title: "One protein, four oxygen carriers",
    text:
      "Hemoglobin is a four-subunit protein in your red blood cells. Tucked inside each subunit is a flat ring called a heme, with a single iron atom at its center — the spot where oxygen binds.",
  },
  {
    key: "binding",
    section: "Oxygen binding",
    title: "The iron snaps into the plane",
    text:
      "With no oxygen bound (the deoxy state) the iron sits slightly above the heme plane. When O₂ docks onto it, the iron is pulled down into the plane and the ring flattens — the small motion that, repeated across all four subunits, lets hemoglobin grab and release oxygen so efficiently.",
  },
];

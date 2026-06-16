import { ComponentType } from "react";
import AnnotatedIron from "./AnnotatedIron";
import AnnotatedPyrrole from "./AnnotatedPyrrole";
import AnnotatedPorphyrin from "./AnnotatedPorphyrin";

// The anatomy build-up, beat by beat, in assembly order (inside-out). The first
// three are atomic parts with a flat annotated schematic *beside* the 3D model;
// the last three are pocket beats (3D-only — no clean 2D schematic) that add the
// histidines and reveal the full heme. The build-up stops here, before the
// alpha/beta chains.
export type Beat =
  | "iron"
  | "pyrrole"
  | "porphyrin"
  | "proximalHis"
  | "distalHis"
  | "heme"
  | "fourHemes";

export type BeatConfig = {
  label: string;
  /** Flat annotated schematic, shown beside the 3D. Absent ⇒ 3D-only beat. */
  Svg?: ComponentType<{ className?: string }>;
  viewer: {
    /** Vendored PDB in /public (never fetch remote — RCSB is blocked). */
    url: string;
    representation: "spacefill" | "ball-and-stick";
    /** If set, color uniformly with this hex; otherwise color by element. */
    uniformColor?: number;
    sizeFactor?: number;
    /** Overlay the Fe as a fatter orange sphere so it stays the visual star. */
    emphasizeIron?: boolean;
  };
};

// Iron's element color in Mol* (matches the SVG sphere) so the panes read as the
// same atom. The ball-and-stick beats use element coloring (Fe orange, N blue,
// C grey) with the Fe emphasized on top.
export const FE_COLOR = 0xe0762e;

export const BEATS: Record<Beat, BeatConfig> = {
  iron: {
    label: "Iron atom",
    Svg: AnnotatedIron,
    viewer: {
      url: "/structures/iron.pdb",
      representation: "spacefill",
      uniformColor: FE_COLOR,
    },
  },
  pyrrole: {
    label: "Pyrrole ring",
    Svg: AnnotatedPyrrole,
    viewer: {
      url: "/structures/iron-pyrrole.pdb",
      representation: "ball-and-stick",
      emphasizeIron: true,
    },
  },
  porphyrin: {
    label: "Porphyrin",
    Svg: AnnotatedPorphyrin,
    viewer: {
      url: "/structures/iron-porphyrin.pdb",
      representation: "ball-and-stick",
      emphasizeIron: true,
    },
  },
  proximalHis: {
    label: "Proximal histidine",
    viewer: {
      url: "/structures/porphyrin-proximal-his.pdb",
      representation: "ball-and-stick",
      emphasizeIron: true,
    },
  },
  distalHis: {
    label: "Distal histidine",
    viewer: {
      url: "/structures/porphyrin-both-his.pdb",
      representation: "ball-and-stick",
      emphasizeIron: true,
    },
  },
  heme: {
    label: "Heme group",
    viewer: {
      url: "/structures/heme-pocket.pdb",
      representation: "ball-and-stick",
      emphasizeIron: true,
    },
  },
  fourHemes: {
    label: "Four heme groups",
    viewer: {
      url: "/structures/four-heme-pockets.pdb",
      representation: "ball-and-stick",
      emphasizeIron: true,
    },
  },
};

export const BEAT_ORDER: Beat[] = [
  "iron",
  "pyrrole",
  "porphyrin",
  "proximalHis",
  "distalHis",
  "heme",
  "fourHemes",
];

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
  | "fourHemes"
  | "dimer"
  | "hemoglobin";

/** A set of protein chains drawn as one uniformly-colored cartoon. */
export type ChainGroup = { chains: string[]; color: number };

export type BeatConfig = {
  label: string;
  /** Flat annotated schematic, shown beside the 3D. Absent ⇒ 3D-only beat. */
  Svg?: ComponentType<{ className?: string }>;
  viewer: {
    /** Vendored PDB in /public (never fetch remote — RCSB is blocked). */
    url: string;
    representation: "spacefill" | "ball-and-stick" | "cartoon";
    /** If set, color uniformly with this hex; otherwise color by element. */
    uniformColor?: number;
    sizeFactor?: number;
    /** Overlay the Fe as a fatter orange sphere so it stays the visual star. */
    emphasizeIron?: boolean;
    /**
     * Draw only these chain groups as cartoon ribbons (one uniform color each),
     * for the chain beats. Takes over from the whole-structure representation.
     */
    chainGroups?: ChainGroup[];
    /**
     * With `chainGroups`, also draw each shown chain's full heme pocket (heme +
     * proximal/distal His + emphasized Fe) — carrying the previous beat's
     * pockets into the chain beats, now wrapped by the ribbons.
     */
    showPockets?: boolean;
    /**
     * Chains whose pockets to draw (with `showPockets`). Defaults to the ribbon
     * chains; set wider to show pockets whose chains aren't drawn yet — the
     * alpha beat shows all four pockets but only the alpha ribbons, so the
     * not-yet-added beta pockets sit bare.
     */
    pocketChains?: string[];
  };
};

// Iron's element color in Mol* (matches the SVG sphere) so the panes read as the
// same atom. The ball-and-stick beats use element coloring (Fe orange, N blue,
// C grey) with the Fe emphasized on top.
export const FE_COLOR = 0xe0762e;

// The two globin chain types, colored for the chain beats: alpha red, beta blue.
export const ALPHA_COLOR = 0xcb4d4d;
export const BETA_COLOR = 0x3e6fb0;

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
  dimer: {
    label: "Alpha–beta dimer",
    viewer: {
      url: "/structures/2HHB.pdb",
      representation: "cartoon",
      // One αβ dimer — half the molecule: an alpha (A, red) clasped to a beta
      // (B, blue).
      chainGroups: [
        { chains: ["A"], color: ALPHA_COLOR },
        { chains: ["B"], color: BETA_COLOR },
      ],
      showPockets: true,
      // All four pockets, but only this dimer's ribbons — the other half's two
      // pockets sit bare, about to get their chains in the next beat.
      pocketChains: ["A", "B", "C", "D"],
    },
  },
  hemoglobin: {
    label: "Hemoglobin",
    viewer: {
      url: "/structures/2HHB.pdb",
      representation: "cartoon",
      // The second αβ dimer (C + D) completes the tetramer — both alphas red,
      // both betas blue. "Together, this is hemoglobin."
      chainGroups: [
        { chains: ["A", "C"], color: ALPHA_COLOR },
        { chains: ["B", "D"], color: BETA_COLOR },
      ],
      showPockets: true,
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
  "dimer",
  "hemoglobin",
];

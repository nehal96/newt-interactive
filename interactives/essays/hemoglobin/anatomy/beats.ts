import { ComponentType } from "react";
import { HB, toHex } from "../palette";

// The anatomy build-up, beat by beat, in assembly order (inside-out). Each beat
// is shown as its 3D model alone. (The first three atomic parts — iron, pyrrole,
// porphyrin — used to carry a flat annotated 2D schematic beside the 3D model;
// those were dropped in favor of a consistent 3D look.) The later beats add the
// histidines, the heme, and finally the alpha/beta chains.
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
  /**
   * Optional flat annotated schematic, shown beside the 3D. Currently unused —
   * every beat renders 3D-only — but kept as an extension point in case a 2D
   * companion is reintroduced for a beat.
   */
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
    /**
     * Override the default camera framing with a fixed orientation (angle only —
     * the auto-fit distance is kept). `direction` is the world-space vector the
     * camera looks along (from camera toward the structure); `up` sets the roll.
     * Used by the pyrrole beat to lock the ring face-on instead of Mol*'s
     * default principal-axis view.
     */
    orientation?: {
      direction: [number, number, number];
      up: [number, number, number];
    };
    /**
     * Zoom factor on top of the auto-fit framing; >1 moves the camera closer so
     * the structure fills more of the pane. Defaults to 1 (plain auto-fit).
     */
    zoom?: number;
  };
};

// Iron's element color in Mol* (matches the SVG sphere) so the panes read as the
// same atom. The ball-and-stick beats use element coloring (Fe orange, N blue,
// C grey) with the Fe emphasized on top.
export const FE_COLOR = toHex(HB.iron.fill);

// Chain ribbon colors, from the shared palette. Chains are colored by TYPE —
// α = blue (chains A, C), β = magenta (chains B, D) — so each chain reads as a
// distinct component as the molecule is built up, and matches the 2D switch.
const ALPHA = toHex(HB.alpha.fill); // α chains (A, C) — blue
const BETA = toHex(HB.beta.fill); //  β chains (B, D) — magenta

export const BEATS: Record<Beat, BeatConfig> = {
  iron: {
    label: "Iron atom",
    viewer: {
      url: "/structures/iron.pdb",
      representation: "spacefill",
      uniformColor: FE_COLOR,
    },
  },
  pyrrole: {
    label: "Pyrrole ring",
    viewer: {
      url: "/structures/iron-pyrrole.pdb",
      representation: "ball-and-stick",
      emphasizeIron: true,
      // Face-on view of the pyrrole ring with the Fe to the left: look along the
      // ring's plane normal (from the iron-pyrrole.pdb ring atoms, Newell), with
      // `up` chosen so the N–Fe bond sits roughly horizontal to the left.
      orientation: {
        direction: [0.6982, -0.714, -0.0522],
        up: [-0.3039, -0.2295, -0.9247],
      },
    },
  },
  porphyrin: {
    label: "Porphyrin",
    viewer: {
      url: "/structures/iron-porphyrin.pdb",
      representation: "ball-and-stick",
      emphasizeIron: true,
      // Face-on view of the macrocycle with the Fe centered: look along the
      // ring system's plane normal (Newell over the 16-membered ring), `up`
      // chosen so the four pyrrole N's sit at the diagonals and the meso bridges
      // at top/right/bottom/left.
      orientation: {
        direction: [0.7682, -0.6352, -0.0804],
        up: [-0.062, 0.0512, -0.9968],
      },
    },
  },
  proximalHis: {
    label: "Proximal histidine",
    viewer: {
      url: "/structures/porphyrin-proximal-his.pdb",
      representation: "ball-and-stick",
      emphasizeIron: true,
      // Default angle, pulled in a little so the histidine reads.
      zoom: 1.1,
    },
  },
  distalHis: {
    label: "Distal histidine",
    viewer: {
      url: "/structures/porphyrin-both-his.pdb",
      representation: "ball-and-stick",
      emphasizeIron: true,
      // Default angle, pulled in a little so the histidines read.
      zoom: 1.3,
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
      // One αβ dimer — half the molecule: an alpha (A, blue) clasped to a beta
      // (B, magenta).
      chainGroups: [
        { chains: ["A"], color: ALPHA },
        { chains: ["B"], color: BETA },
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
      // The second αβ dimer (C + D) completes the tetramer — both alphas blue,
      // both betas magenta. "Together, this is hemoglobin."
      chainGroups: [
        { chains: ["A", "C"], color: ALPHA },
        { chains: ["B", "D"], color: BETA },
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

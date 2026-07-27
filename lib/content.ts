// The homepage index, in one place.
//
// Titles and subtitles are copied verbatim from each page's exported
// `metadata` — the pages stay the source of truth for their own words; this is
// the catalogue that lists them. (The homepage can't import those `metadata`
// objects directly: doing so would pull every essay's interactive components
// into the homepage bundle.) When you publish a piece, add a row here.
//
// Covers are drawn, not screenshotted — `art` names a motif in
// components/CoverArt, which draws every piece from one shared vocabulary.
// `cover` is the escape hatch for a piece that already has a better image than
// a motif would be (right now: hemoglobin's red heme illustration). Captured
// stills, if you ever want them back, come from scripts/covers.mjs.

import type { Motif } from "../components/CoverArt";

export type PieceKind = "essay" | "series" | "block" | "note";

export interface Piece {
  href: string;
  kind: PieceKind;
  title: string;
  subtitle: string;
  /** ISO date; drives sort order and the displayed month/year. */
  published: string;
  updated?: string;
  /** Drawn cover. One of `art` or `cover` — `art` wins if both are set. */
  art?: Motif;
  /** Captured cover, as a path under public/. */
  cover?: string;
  /**
   * Hover colour for this piece's title, as a hex string — for a piece whose
   * cover has a strong colour of its own to answer to. Defaults to indigo.
   * Passed through as a CSS variable rather than a class name: Tailwind's
   * content globs don't cover lib/, so a class written here would be purged.
   */
  accent?: string;
  /** Shown large at the top of the index. At most one. */
  featured?: boolean;
  /** Series only — how many parts it runs to. */
  parts?: number;
}

export const KIND_LABEL: Record<PieceKind, string> = {
  essay: "Essay",
  series: "Series",
  block: "Block",
  note: "Notes",
};

export const PIECES: Piece[] = [
  {
    href: "/essays/hemoglobin",
    kind: "essay",
    title: "The Story of Hemoglobin",
    subtitle:
      "How a special protein in red blood cells transports oxygen around your body",
    published: "2026-06-23",
    // The one piece that keeps a painted cover rather than a motif — the red
    // heme illustration is already the emblem, and it sets the accent the
    // drawn covers pick up one element at a time.
    cover: "/images/hemoglobin-illustration-red.png",
    // Sampled off the illustration's ground, so the title answers the cover.
    accent: "#872421",
    featured: true,
  },
  {
    href: "/series/systems-biology",
    kind: "series",
    title: "Systems Biology",
    subtitle:
      "Dive deep into complex biological systems through interactive explainers",
    published: "2024-09-23",
    art: "network-layered",
    parts: 5,
  },
  {
    href: "/blocks/c1-ffl",
    kind: "block",
    title: "Coherent Type I Feed-Forward Loop",
    subtitle: "A playground for understanding C1-FFL circuits",
    published: "2024-12-27",
    updated: "2025-01-20",
    art: "circuit",
  },
  {
    href: "/blocks/circuit-evolution",
    kind: "block",
    title: "Circuit Evolution Simulator",
    subtitle: "A basic model of how genetic circuits can evolve",
    published: "2024-11-26",
    updated: "2024-12-02",
    art: "generations",
  },
  {
    href: "/blocks/erdos-renyi-graph",
    kind: "block",
    title: "Erdős-Rényi Graphs",
    subtitle: "How to model random networks",
    published: "2024-10-30",
    art: "network",
  },
  {
    href: "/notes/threejs-journey",
    kind: "note",
    title: "Three.js Journey",
    subtitle: "Notes from Bruno Simon's course on 3D graphics for the web",
    published: "2022-02-08",
    updated: "2024-07-31",
    art: "wireframe",
  },
  {
    href: "/blocks/kalman-filters",
    kind: "block",
    title: "Kalman Filters",
    subtitle:
      "How to combine uncertain information to make predictions in a continuously changing 1D environment",
    published: "2022-01-23",
    art: "distributions",
  },
  {
    href: "/blocks/robot-localization",
    kind: "block",
    title: "Simple Robot Localization",
    subtitle:
      "The algorithm behind how a robot finds its location in a simple environment",
    published: "2022-01-09",
    art: "bars",
  },
  {
    href: "/blocks/dna",
    kind: "block",
    title: "DNA in 3D",
    subtitle: "A simplified model of a DNA molecule",
    published: "2021-12-30",
    art: "helix",
  },
];

export const featuredPiece = PIECES.find((p) => p.featured);

export const restOfPieces = PIECES.filter((p) => !p.featured).sort(
  (a, b) => (a.published < b.published ? 1 : -1)
);

/**
 * The small index thumbnail for a captured cover. scripts/covers.mjs writes a
 * `-thumb` beside everything it shoots — same capture, cropped in rather than
 * shrunk down so it still reads at 160px — so only files it owns get the swap;
 * anything else is served at full size. Drawn covers need no equivalent:
 * they're vector, and their motifs are composed to survive the small size.
 */
export const thumbFor = (piece: Piece) =>
  piece.cover?.startsWith("/images/covers/")
    ? piece.cover.replace(/\.png$/, "-thumb.png")
    : piece.cover;

/** "June 2026" — month precision is enough for an index. */
export function formatMonth(iso: string): string {
  const [y, m] = iso.split("-");
  const month = new Date(Number(y), Number(m) - 1, 1).toLocaleString("en-US", {
    month: "long",
  });
  return `${month} ${y}`;
}

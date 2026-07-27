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
// a motif would be (right now: hemoglobin's red heme illustration).

import type { Motif } from "../components/CoverArt";

export type PieceKind = "essay" | "series" | "block" | "note";

/** One instalment of a series, as the index lists it. */
export interface SeriesPart {
  href: string;
  /**
   * The series page's own short label, not the article's metadata title — the
   * list is numbered, so "Transcription Network Basics: Part One" would say
   * "part one" twice.
   */
  title: string;
  published: string;
  /**
   * Optional grouping, used by the series' own page to set its instalments
   * under subheadings. The homepage ignores it and lists them flat — a row in
   * the index is showing the shape of the series, not its table of contents.
   */
  section?: string;
}

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
  /** Ready-made cover image, as a path under public/. */
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
  /**
   * Kept for the record rather than shown off: drops out of the main index and
   * into the archive list at the bottom, as a title and a date on one line.
   */
  archived?: boolean;
  /** Series only — its instalments, in reading order. */
  parts?: SeriesPart[];
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
    parts: [
      {
        href: "/series/systems-biology/transcription-network-basics-1",
        title: "Transcription Network Basics",
        published: "2024-09-26",
        section: "Introduction to Transcription Networks",
      },
      {
        href: "/series/systems-biology/transcription-network-basics-2",
        title: "Activators and Repressors",
        published: "2024-10-06",
        section: "Introduction to Transcription Networks",
      },
      {
        href: "/series/systems-biology/transcription-network-basics-3",
        title: "Dynamics and Response Time",
        published: "2024-10-27",
        section: "Introduction to Transcription Networks",
      },
      {
        href: "/series/systems-biology/autoregulation-1",
        title: "Autoregulation as a Network Motif",
        published: "2024-11-02",
        section: "Autoregulation",
      },
      {
        href: "/series/systems-biology/autoregulation-2",
        title: "Dynamics of Negative Autoregulation",
        published: "2024-12-15",
        section: "Autoregulation",
      },
    ],
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
    archived: true,
  },
];

const byNewest = (a: Piece, b: Piece) => (a.published < b.published ? 1 : -1);

export const featuredPiece = PIECES.find((p) => p.featured);

export const restOfPieces = PIECES.filter(
  (p) => !p.featured && !p.archived
).sort(byNewest);

export const archivedPieces = PIECES.filter((p) => p.archived).sort(byNewest);

/** The catalogue row for a page, so a page can render its own entry rather
 *  than keeping a second hand-maintained copy of it. */
export const getPiece = (href: string) => PIECES.find((p) => p.href === href);

/**
 * A series' parts, grouped under their `section` headings and carrying the
 * number each group starts at — the numbering runs on across the groups, so
 * the reader sees one ordered series rather than two short lists.
 * Parts with no `section` fall into a single unlabelled group.
 */
export function partsBySection(parts: SeriesPart[] = []) {
  const groups: { section?: string; start: number; parts: SeriesPart[] }[] = [];

  parts.forEach((part, i) => {
    const last = groups[groups.length - 1];
    if (last && last.section === part.section) last.parts.push(part);
    else groups.push({ section: part.section, start: i + 1, parts: [part] });
  });

  return groups;
}

/** "Jun 2026" — month precision is enough for an index, abbreviated so the
 *  dates stay a short stamp beside the kind label rather than a phrase. */
export function formatMonth(iso: string): string {
  const [y, m] = iso.split("-");
  const month = new Date(Number(y), Number(m) - 1, 1).toLocaleString("en-US", {
    month: "short",
  });
  return `${month} ${y}`;
}

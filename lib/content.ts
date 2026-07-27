// The homepage catalogue: every published piece, in one place.

import type { Motif } from "../components/CoverArt";

export type PieceKind = "essay" | "series" | "block" | "note";

export interface SeriesPart {
  href: string;
  /** The list's own short label, not the article's `metadata` title. */
  title: string;
  published: string;
  section?: string;
}

export interface Piece {
  href: string;
  kind: PieceKind;
  title: string;
  subtitle: string;
  published: string;
  /** One of `art` or `cover`; `art` wins if both are set. */
  art?: Motif;
  cover?: string;
  /** Title hover colour, as a hex — a class here is outside Tailwind's globs. */
  accent?: string;
  /** At most one piece sets this. */
  featured?: boolean;
  archived?: boolean;
  /** In reading order — the index numbers them by position. */
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
    cover: "/images/hemoglobin-illustration-red.png",
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
    art: "circuit",
  },
  {
    href: "/blocks/circuit-evolution",
    kind: "block",
    title: "Circuit Evolution Simulator",
    subtitle: "A basic model of how genetic circuits can evolve",
    published: "2024-11-26",
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

export const getPiece = (href: string) => PIECES.find((p) => p.href === href);

/** Numbering runs on across the groups. Parts with no `section` form one. */
export function partsBySection(parts: SeriesPart[] = []) {
  const groups: { section?: string; start: number; parts: SeriesPart[] }[] = [];

  parts.forEach((part, i) => {
    const last = groups[groups.length - 1];
    if (last && last.section === part.section) last.parts.push(part);
    else groups.push({ section: part.section, start: i + 1, parts: [part] });
  });

  return groups;
}

export function formatMonth(iso: string): string {
  const [y, m] = iso.split("-");
  const month = new Date(Number(y), Number(m) - 1, 1).toLocaleString("en-US", {
    month: "short",
  });
  return `${month} ${y}`;
}

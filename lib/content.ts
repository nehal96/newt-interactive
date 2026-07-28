// The catalogue: every published piece, in one place. A piece that owns a
// meta.ts is listed by importing it — its title and subtitle live in one file.

import {
  definePiece,
  type Piece,
  type PieceKind,
  type SeriesPart,
} from "./piece";
import c1ffl from "../pages/blocks/c1-ffl/meta";
import dna from "../pages/blocks/dna/meta";
import circuitEvolution from "../pages/blocks/circuit-evolution/meta";
import systemsBiology from "../pages/series/systems-biology/meta";
import erdosRenyiGraph from "../pages/blocks/erdos-renyi-graph/meta";
import kalmanFilters from "../pages/blocks/kalman-filters/meta";
import robotLocalization from "../pages/blocks/robot-localization/meta";
import threejsJourney from "../pages/notes/threejs-journey/meta";

export type { Piece, PieceKind, SeriesPart } from "./piece";

export const KIND_LABEL: Record<PieceKind, string> = {
  essay: "Essay",
  series: "Series",
  block: "Block",
  note: "Notes",
};

export const PIECES: Piece[] = [
  definePiece({
    href: "/essays/hemoglobin",
    kind: "essay",
    title: "The Story of Hemoglobin",
    subtitle:
      "How a special protein in red blood cells transports oxygen around your body",
    published: "2026-06-23",
    cover: "/images/hemoglobin-illustration-red.png",
    accent: "#872421",
    featured: true,
  }),
  systemsBiology,
  c1ffl,
  circuitEvolution,
  erdosRenyiGraph,
  threejsJourney,
  kalmanFilters,
  robotLocalization,
  dna,
];

const byNewest = (a: { published: string }, b: { published: string }) =>
  a.published < b.published ? 1 : -1;

export const featuredPiece = PIECES.find((p) => p.featured);

export const restOfPieces = PIECES.filter(
  (p) => !p.featured && !p.archived
).sort(byNewest);

export const archivedPieces = PIECES.filter((p) => p.archived).sort(byNewest);

export const getPiece = (href: string) => PIECES.find((p) => p.href === href);

export interface CatalogueEntry {
  href: string;
  title: string;
  description: string;
  published: string;
}

export const catalogueEntries: CatalogueEntry[] = PIECES.flatMap((piece) => [
  {
    href: piece.href,
    title: piece.title,
    description: piece.subtitle,
    published: piece.published,
  },
  ...(piece.parts ?? []).map((part, i) => ({
    href: part.href,
    title: part.title,
    description: `Part ${i + 1} of the ${piece.title} series.`,
    published: part.published,
  })),
]).sort(byNewest);

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

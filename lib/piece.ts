import { SITE_URL } from "./links";
import type { Motif } from "./motifs";

export type PieceKind = "essay" | "series" | "block" | "note";

export interface SeriesPart {
  href: string;
  /** The list's own short label, not the piece's own title. */
  title: string;
  published: string;
  section?: string;
}

export interface PieceInput {
  href: string;
  kind: PieceKind;
  title: string;
  subtitle: string;
  /** Set once a piece owns its own SEO through this file. */
  description?: string;
  keywords?: string;
  published: string;
  updated?: string;
  /** One of `art` or `cover`; `art` wins if both are set. */
  art?: Motif;
  cover?: string;
  /** Only for a piece whose card isn't at /images/og/<art>.png. */
  ogImage?: string;
  /** A landing page is a website; a piece that reads as one is an article. */
  ogType?: "article" | "website";
  /** Title hover colour, as a hex — a class here is outside Tailwind's globs. */
  accent?: string;
  /** At most one piece sets this. */
  featured?: boolean;
  archived?: boolean;
  /** In reading order — the index numbers them by position. */
  parts?: SeriesPart[];
  series?: { name: string; href: string };
  subtitleNode?: React.ReactNode;
}

export interface Piece extends PieceInput {
  url: string;
  ogImage: string;
}

/**
 * `url` and `ogImage` are derived, never written: a canonical typed by hand
 * drifts onto the apex, which 308s, and an og path typed by hand outlives the
 * motif it names.
 */
export function definePiece(input: PieceInput): Piece {
  const ogImage =
    input.ogImage ??
    (input.art ? `${SITE_URL}/images/og/${input.art}.png` : `${SITE_URL}${input.cover}`);

  return { ...input, url: `${SITE_URL}${input.href}`, ogImage };
}

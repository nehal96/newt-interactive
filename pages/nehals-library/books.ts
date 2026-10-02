import type { BookRow } from "@lib/library/db";

export type Kind = "fiction" | "nonfiction" | "magazine";

export type Book = {
  id: string;
  title: string;
  subtitle: string | null;
  authors: string[];
  byline: string;
  publisher: string;
  format: string | null;
  kind: Kind;
  year: number | null;
  cover: { src: string; width: number; height: number; color: string } | null;
  heightMm: number;
  widthMm: number;
};

// Fallback heights for books never measured from a shelf photo.
const HEIGHT_BY_FORMAT: Record<string, number> = {
  hardcover: 240,
  paperback: 198,
  "mass-market": 175,
  magazine: 285,
};

export function toBook(r: BookRow): Book {
  const heightMm = r.height_mm ?? HEIGHT_BY_FORMAT[r.format ?? ""] ?? 210;
  const cover =
    r.cover_url && r.cover_width && r.cover_height
      ? { src: r.cover_url, width: r.cover_width, height: r.cover_height, color: r.cover_color ?? "#ddd" }
      : null;
  return {
    id: r.id,
    title: r.title,
    subtitle: r.subtitle,
    authors: r.authors,
    byline: r.byline,
    publisher: r.publisher ?? "",
    format: r.format,
    kind: r.kind,
    year: r.first_published ?? r.edition_year,
    cover,
    heightMm,
    widthMm: cover ? (heightMm * cover.width) / cover.height : heightMm * 0.66,
  };
}

export function formatYear(y: number | null) {
  if (y == null) return "";
  return y < 0 ? `c. ${-y} BC` : String(y);
}

const ARTICLE = /^(the|a|an)\s+/i;
export const titleKey = (b: Book) => b.title.replace(ARTICLE, "").toLowerCase();
export const authorKey = (b: Book) => (b.authors[0] ?? "").split(" ").pop()!.toLowerCase();

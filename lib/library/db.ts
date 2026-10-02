// Nehal's Library storage: one `books` table in Neon Postgres. Server-only.
import { neon } from "@neondatabase/serverless";

export type BookRow = {
  id: string;
  title: string;
  subtitle: string | null;
  authors: string[];
  byline: string;
  series: string | null;
  series_index: number | null;
  publisher: string | null;
  format: string | null;
  format_confirmed: boolean;
  kind: "fiction" | "nonfiction" | "magazine";
  genre: string | null;
  first_published: number | null;
  edition_year: number | null;
  notes: string | null;
  isbn: string | null;
  read_status: string | null;
  height_mm: number | null;
  cover_url: string | null;
  cover_width: number | null;
  cover_height: number | null;
  cover_color: string | null;
  cover_source: string | null;
  cover_source_url: string | null;
  cover_rejected: string | null;
  confidence: string | null;
  confidence_note: string | null;
  created_at: string;
  updated_at: string;
};

// Columns a caller may write; id, timestamps and nothing else are managed here.
export const WRITABLE = [
  "title", "subtitle", "authors", "byline", "series", "series_index", "publisher", "format",
  "format_confirmed", "kind", "genre", "first_published", "edition_year", "notes", "isbn",
  "read_status", "height_mm", "cover_url", "cover_width", "cover_height", "cover_color",
  "cover_source", "cover_source_url", "cover_rejected", "confidence", "confidence_note",
] as const;
export type Writable = Partial<Pick<BookRow, (typeof WRITABLE)[number]>>;

export const SCHEMA = `
create table if not exists books (
  id text primary key,
  title text not null,
  subtitle text,
  authors text[] not null default '{}',
  byline text not null default '',
  series text,
  series_index int,
  publisher text,
  format text,
  format_confirmed boolean not null default false,
  kind text not null check (kind in ('fiction', 'nonfiction', 'magazine')),
  genre text,
  first_published int,
  edition_year int,
  notes text,
  isbn text unique,
  read_status text,
  height_mm int,
  cover_url text,
  cover_width int,
  cover_height int,
  cover_color text,
  cover_source text,
  cover_source_url text,
  cover_rejected text,
  confidence text,
  confidence_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
)`;

function sql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  return neon(url);
}

export async function allBooks(): Promise<BookRow[]> {
  return (await sql().query("select * from books order by lower(title)")) as BookRow[];
}

export async function getBook(id: string): Promise<BookRow | undefined> {
  return ((await sql().query("select * from books where id = $1", [id])) as BookRow[])[0];
}

export async function findByIsbn(isbn: string): Promise<BookRow | undefined> {
  return ((await sql().query("select * from books where isbn = $1", [isbn])) as BookRow[])[0];
}

export async function searchBooks(query: string, limit = 25): Promise<BookRow[]> {
  const q = `%${query.toLowerCase()}%`;
  return (await sql().query(
    `select * from books
     where $1 = '%%' or lower(title) like $1 or lower(byline) like $1 or lower(coalesce(publisher, '')) like $1 or isbn like $1 or id like $1
     order by lower(title) limit $2`,
    [q, limit],
  )) as BookRow[];
}

export async function genres(): Promise<{ genre: string; books: number }[]> {
  return (await sql().query(
    "select genre, count(*)::int as books from books where genre is not null group by genre order by books desc, genre",
  )) as { genre: string; books: number }[];
}

export async function insertBook(id: string, fields: Writable & Pick<BookRow, "title" | "kind">): Promise<BookRow> {
  const cols = Object.keys(fields).filter((k) => (WRITABLE as readonly string[]).includes(k));
  const values = cols.map((k) => fields[k as keyof Writable]);
  const rows = await sql().query(
    `insert into books (id, ${cols.join(", ")}) values ($1, ${cols.map((_, i) => `$${i + 2}`).join(", ")}) returning *`,
    [id, ...values],
  );
  return (rows as BookRow[])[0];
}

export async function updateBook(id: string, fields: Writable): Promise<BookRow | undefined> {
  const cols = Object.keys(fields).filter((k) => (WRITABLE as readonly string[]).includes(k));
  if (cols.length === 0) return getBook(id);
  const rows = await sql().query(
    `update books set ${cols.map((k, i) => `${k} = $${i + 2}`).join(", ")}, updated_at = now() where id = $1 returning *`,
    [id, ...cols.map((k) => fields[k as keyof Writable])],
  );
  return (rows as BookRow[])[0];
}

export async function deleteBook(id: string): Promise<boolean> {
  return ((await sql().query("delete from books where id = $1 returning id", [id])) as unknown[]).length > 0;
}

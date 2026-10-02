// MCP connector for Nehal's Library, at /api/mcp/<LIBRARY_MCP_SECRET>: Claude reads a photo, these tools write the books table and covers.
import type { NextApiRequest, NextApiResponse } from "next";
import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { type BookRow, type Writable, deleteBook, findByIsbn, genres, getBook, insertBook, searchBooks, updateBook } from "@lib/library/db";
import { fetchImage, findCover, lookupDetails, normalizeIsbn, preview, slugify, storeCover } from "@lib/library/lookup";

const INSTRUCTIONS = `Tools for Nehal's personal library, shown at newtinteractive.com/nehals-library.

Every record describes Nehal's own copy — the edition in their photo — not the book in general.

Adding a book from a photo or screenshot:
1. Read the ISBN-13 (under the barcode on the back, or on the copyright page; on an Amazon page, the "ISBN-13" line). If none is visible, ask for a photo of the back cover. Never take an ISBN from a web search — that is some edition, not necessarily theirs.
2. Call lookup_isbn. It returns the catalogue details and the cover it found, as an image.
3. Compare against the photo and fix what's wrong when you call add_book:
   - title with the printed capitalisation (catalogues often return sentence case);
   - publisher = the imprint whose logo is on the spine (e.g. "The Bodley Head", not just "Penguin"); catalogue publishers can be badly wrong;
   - format: hardcover, paperback, or mass-market (small pocket size);
   - first_published = the year the work first appeared, not this printing; catalogues often give a reissue year, and nonsense for ancient works (use negative years for BC);
   - kind and genre: reuse an existing genre from list_genres where one fits.
4. Check the cover: same design and publisher logo as the photo, flat cover art (reject 3D product mock-ups), at least ~800px tall. If it's wrong, pass cover_url with a better image of this exact edition, or skip_cover and tell Nehal a cover photo is needed.
5. After adding, reply briefly: what was added, where the cover came from, and anything you weren't sure of.

Use update_book for read status ("read", "reading", "unread") and corrections. Never remove a book unless Nehal explicitly asks.`;

const FORMAT = z.enum(["hardcover", "paperback", "mass-market", "magazine"]);
const KIND = z.enum(["fiction", "nonfiction", "magazine"]);

const editable = {
  title: z.string().min(1),
  subtitle: z.string().nullable(),
  authors: z.array(z.string().min(1)).describe("Each author as printed, e.g. ['Kai Bird', 'Martin J. Sherwin']"),
  byline: z.string().describe("Display line; defaults to the authors joined with 'and'"),
  publisher: z.string().describe("The imprint on the spine"),
  format: FORMAT,
  kind: KIND,
  genre: z.string(),
  first_published: z.number().int().nullable().describe("Year the work first appeared; negative for BC"),
  edition_year: z.number().int().nullable(),
  series: z.string().nullable(),
  series_index: z.number().int().nullable(),
  notes: z.string().nullable().describe("Translator, edition details, provenance"),
  read_status: z.enum(["read", "reading", "unread"]).nullable(),
};

const text = (value: unknown) => ({ type: "text" as const, text: typeof value === "string" ? value : JSON.stringify(value, null, 2) });
const image = (base64: string) => ({ type: "image" as const, data: base64, mimeType: "image/jpeg" });
const fail = (message: string) => ({ content: [text(message)], isError: true });

const summary = (b: BookRow) => ({
  id: b.id, title: b.title, subtitle: b.subtitle, byline: b.byline, publisher: b.publisher, format: b.format,
  kind: b.kind, genre: b.genre, first_published: b.first_published, isbn: b.isbn, read_status: b.read_status,
  cover: b.cover_url ? `${b.cover_source} ${b.cover_width}×${b.cover_height}` : b.cover_rejected ? `rejected: ${b.cover_rejected}` : "none",
});

const joinAuthors = (a: string[]) => (a.length > 1 ? `${a.slice(0, -1).join(", ")} and ${a[a.length - 1]}` : (a[0] ?? ""));

function server(origin: string) {
  const refresh = () =>
    fetch(`${origin}/api/library/revalidate`, { method: "POST", headers: { "x-library-secret": process.env.LIBRARY_MCP_SECRET! } }).catch(() => null);

  return createMcpHandler(
    (s) => {
      s.registerTool(
        "lookup_isbn",
        {
          title: "Look up an ISBN",
          description: "Catalogue details and the best edition-exact cover for an ISBN, and whether it's already in the library. Read-only.",
          inputSchema: z.object({ isbn: z.string() }),
          annotations: { readOnlyHint: true },
        },
        async ({ isbn: raw }) => {
          const isbn = normalizeIsbn(raw);
          if (!isbn) return fail(`"${raw}" is not a valid ISBN-10 or ISBN-13.`);
          const [existing, details, cover] = await Promise.all([findByIsbn(isbn), lookupDetails(isbn), findCover(isbn)]);
          const content = [text({ isbn, already_in_library: existing ? summary(existing) : null, details, cover: cover ? { source: cover.source, url: cover.sourceUrl } : null })];
          if (cover) {
            const p = await preview(cover.buf);
            content.push(text(`Cover found (${cover.source}, ${p.width}×${p.height}):`), image(p.base64) as never);
          }
          return { content };
        },
      );

      s.registerTool(
        "add_book",
        {
          title: "Add a book",
          description: "Add a book to the library and publish it. Finds the cover by ISBN unless cover_url or skip_cover is given.",
          inputSchema: z.object({
            isbn: z.string().nullable().describe("ISBN-13 from the photo; null only for books printed without one"),
            ...editable,
            subtitle: editable.subtitle.optional(),
            byline: editable.byline.optional(),
            edition_year: editable.edition_year.optional(),
            series: editable.series.optional(),
            series_index: editable.series_index.optional(),
            notes: editable.notes.optional(),
            read_status: editable.read_status.optional(),
            first_published: editable.first_published.optional(),
            cover_url: z.string().url().optional().describe("Image of this exact edition's front cover, if the ISBN lookup's cover is wrong"),
            skip_cover: z.boolean().optional(),
          }),
        },
        async ({ isbn: raw, cover_url, skip_cover, ...fields }) => {
          const isbn = raw ? normalizeIsbn(raw) : null;
          if (raw && !isbn) return fail(`"${raw}" is not a valid ISBN-10 or ISBN-13.`);
          if (isbn) {
            const existing = await findByIsbn(isbn);
            if (existing) return fail(`Already in the library as "${existing.title}" (${existing.id}). Use update_book to change it.`);
          }
          let id = slugify(fields.title);
          if (await getBook(id)) id = `${id}-${isbn?.slice(-4) ?? Date.now().toString(36)}`;

          const row: Writable & Pick<BookRow, "title" | "kind"> = {
            ...fields,
            byline: fields.byline ?? joinAuthors(fields.authors),
            isbn,
            format_confirmed: true,
            confidence: isbn ? "high" : "medium",
            confidence_note: isbn ? "ISBN read from Nehal's photo" : "No ISBN; details from the photo",
          };

          let found = null as null | { buf: Buffer; source: string; sourceUrl: string };
          if (!skip_cover) {
            if (cover_url) {
              const buf = await fetchImage(cover_url);
              if (!buf) return fail(`Couldn't use ${cover_url}: not reachable, or under 400px tall.`);
              found = { buf, source: "url", sourceUrl: cover_url };
            } else if (isbn) {
              found = await findCover(isbn);
            }
          }
          if (found) Object.assign(row, await storeCover(id, found.buf, found.source, found.sourceUrl));

          const book = await insertBook(id, row);
          await refresh();
          return {
            content: [
              text({ added: summary(book), live: `${origin}/nehals-library` }),
              ...(found ? [image((await preview(found.buf)).base64) as never] : [text("No cover — ask Nehal for a photo of the front cover.")]),
            ],
          };
        },
      );

      s.registerTool(
        "update_book",
        {
          title: "Update a book",
          description: "Change fields on a book (read status, corrections). Only the fields given are changed.",
          inputSchema: z.object({ id: z.string(), changes: z.object(editable).partial() }),
          annotations: { idempotentHint: true },
        },
        async ({ id, changes }) => {
          const book = await updateBook(id, changes);
          if (!book) return fail(`No book with id "${id}". Use search_books to find it.`);
          await refresh();
          return { content: [text({ updated: summary(book) })] };
        },
      );

      s.registerTool(
        "set_cover",
        {
          title: "Set a book's cover",
          description: "Replace a book's cover with an image of its exact edition, from a URL.",
          inputSchema: z.object({ id: z.string(), image_url: z.string().url() }),
        },
        async ({ id, image_url }) => {
          if (!(await getBook(id))) return fail(`No book with id "${id}".`);
          const buf = await fetchImage(image_url);
          if (!buf) return fail(`Couldn't use ${image_url}: not reachable, or under 400px tall.`);
          const book = await updateBook(id, await storeCover(id, buf, "url", image_url));
          await refresh();
          return { content: [text({ updated: summary(book!) }), image((await preview(buf)).base64) as never] };
        },
      );

      s.registerTool(
        "reject_cover",
        {
          title: "Reject a book's cover",
          description: "Remove a wrong cover (wrong edition, mock-up). The page shows a typeset stand-in until a correct one is set.",
          inputSchema: z.object({ id: z.string(), reason: z.string() }),
        },
        async ({ id, reason }) => {
          const book = await updateBook(id, {
            cover_url: null, cover_width: null, cover_height: null, cover_color: null, cover_source: null, cover_source_url: null, cover_rejected: reason,
          });
          if (!book) return fail(`No book with id "${id}".`);
          await refresh();
          return { content: [text({ updated: summary(book) })] };
        },
      );

      s.registerTool(
        "search_books",
        {
          title: "Search the library",
          description: "Find books by title, author, publisher, ISBN or id. An empty query lists the first books alphabetically.",
          inputSchema: z.object({ query: z.string().default(""), limit: z.number().int().min(1).max(200).default(25) }),
          annotations: { readOnlyHint: true },
        },
        async ({ query, limit }) => {
          const books = await searchBooks(query, limit);
          return { content: [text(books.map(summary))] };
        },
      );

      s.registerTool(
        "list_genres",
        {
          title: "List genres",
          description: "Every genre string in use, with how many books carry it. Reuse one of these for new books where it fits.",
          inputSchema: z.object({}),
          annotations: { readOnlyHint: true },
        },
        async () => ({ content: [text(await genres())] }),
      );

      s.registerTool(
        "remove_book",
        {
          title: "Remove a book",
          description: "Delete a book from the library. Only when Nehal explicitly asks; confirm must be true.",
          inputSchema: z.object({ id: z.string(), confirm: z.literal(true) }),
          annotations: { destructiveHint: true },
        },
        async ({ id }) => {
          const book = await getBook(id);
          if (!book || !(await deleteBook(id))) return fail(`No book with id "${id}".`);
          await refresh();
          return { content: [text(`Removed "${book.title}".`)] };
        },
      );
    },
    { serverInfo: { name: "nehals-library", version: "1.0.0" }, instructions: INSTRUCTIONS },
  );
}

// mcp-handler reads the raw body itself.
export const config = { api: { bodyParser: false } };

async function readBody(req: NextApiRequest) {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  return Buffer.concat(chunks);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const expected = process.env.LIBRARY_MCP_SECRET;
  if (!expected || req.query.secret !== expected) return res.status(404).end();

  const proto = (req.headers["x-forwarded-proto"] as string | undefined)?.split(",")[0] ?? "http";
  const origin = `${proto}://${req.headers["x-forwarded-host"] ?? req.headers.host}`;
  const headers = new Headers();
  for (const [k, v] of Object.entries(req.headers)) if (v !== undefined) headers.set(k, Array.isArray(v) ? v.join(", ") : v);
  const body = req.method === "GET" || req.method === "HEAD" ? undefined : await readBody(req);

  const response = await server(origin)(new Request(`${origin}${req.url}`, { method: req.method, headers, body }));

  res.status(response.status);
  response.headers.forEach((v, k) => res.setHeader(k, v));
  if (!response.body) return res.end();
  const reader = response.body.getReader();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    res.write(value);
  }
  res.end();
}

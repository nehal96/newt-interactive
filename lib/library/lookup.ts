// ISBN lookups and cover storage for Nehal's Library. Server-only.
import crypto from "node:crypto";
import sharp from "sharp";
import { put } from "@vercel/blob";

const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128 Safari/537.36";
// Below this the source is a thumbnail or a "no image" placeholder, not a cover.
const MIN_HEIGHT = 400;
const MASTER_HEIGHT = 1600;

const digits = (s: string) => s.split("").map((d) => (d === "X" ? 10 : Number(d)));
const ean13Check = (body12: string) => (10 - (digits(body12).reduce((t, d, i) => t + d * (i % 2 ? 3 : 1), 0) % 10)) % 10;

export function normalizeIsbn(raw: string): string | null {
  const s = raw.replace(/[^0-9Xx]/g, "").toUpperCase();
  if (s.length === 13 && digits(s).reduce((t, d, i) => t + d * (i % 2 ? 3 : 1), 0) % 10 === 0) return s;
  if (s.length === 10 && digits(s).reduce((t, d, i) => t + (10 - i) * d, 0) % 11 === 0) {
    const body = "978" + s.slice(0, 9);
    return body + ean13Check(body);
  }
  return null;
}

function isbn10(isbn: string) {
  if (!isbn.startsWith("978")) return null;
  const body = isbn.slice(3, 12);
  const check = (11 - (digits(body).reduce((t, d, k) => t + (10 - k) * d, 0) % 11)) % 11;
  return body + (check === 10 ? "X" : String(check));
}

async function get(url: string) {
  const res = await fetch(url, { headers: { "User-Agent": UA }, redirect: "follow" }).catch(() => null);
  return res?.ok ? res : null;
}

export function slugify(s: string) {
  return s.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export type Details = {
  title: string | null;
  subtitle: string | null;
  authors: string[];
  publisher: string | null;
  format: string | null;
  pages: number | null;
  editionYear: number | null;
  firstPublished: number | null;
};

// Goodreads answers scripted traffic with an empty 202 challenge once it's had enough, so
// one lookup fetches its page once, and an empty page counts as "no Goodreads data".
const goodreadsPages = new Map<string, { at: number; page: Promise<string | undefined> }>();
function goodreadsPage(isbn: string) {
  const hit = goodreadsPages.get(isbn);
  if (hit && Date.now() - hit.at < 60_000) return hit.page;
  const page = get(`https://www.goodreads.com/book/isbn/${isbn}`)
    .then((r) => r?.text())
    .then((html) => (html?.includes(isbn) ? html : undefined))
    .catch(() => undefined);
  goodreadsPages.set(isbn, { at: Date.now(), page });
  return page;
}

export async function lookupDetails(isbn: string): Promise<Details> {
  const [olRes, firstRes, gr] = await Promise.all([
    get(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`),
    get(`https://openlibrary.org/search.json?isbn=${isbn}&fields=first_publish_year`),
    goodreadsPage(isbn),
  ]);
  const ol = (await olRes?.json().catch(() => null))?.[`ISBN:${isbn}`];
  const first = (await firstRes?.json().catch(() => null))?.docs?.[0];
  const grField = (k: string) => gr?.match(new RegExp(`"${k}":"([^"]*)"`))?.[1];
  return {
    title: ol?.title ?? null,
    subtitle: ol?.subtitle ?? null,
    authors: ol?.authors?.map((a: { name: string }) => a.name) ?? [],
    publisher: grField("publisher") ?? ol?.publishers?.[0]?.name ?? null,
    format: grField("format")?.toLowerCase() ?? null,
    pages: ol?.number_of_pages ?? null,
    editionYear: Number(String(ol?.publish_date ?? "").match(/\d{4}/)?.[0]) || null,
    firstPublished: first?.first_publish_year ?? null,
  };
}

export type FoundCover = { buf: Buffer; source: string; sourceUrl: string };

export const COVER_SOURCES = ["amazon", "apple", "goodreads", "openlibrary"] as const;
export type CoverSource = (typeof COVER_SOURCES)[number];

const COVER_URL: Record<CoverSource, (isbn: string) => Promise<string | null | undefined>> = {
  amazon: async (isbn) => {
    const i10 = isbn10(isbn);
    return i10 && `https://images-na.ssl-images-amazon.com/images/P/${i10}.01._SCRMZZZZZZ_.jpg`;
  },
  apple: async (isbn) => {
    const json = await (await get(`https://itunes.apple.com/lookup?isbn=${isbn}`))?.json().catch(() => null);
    const art: string | undefined = json?.results?.[0]?.artworkUrl100;
    return art?.replace(/\/\d+x\d+bb\./, "/1600x1600bb.");
  },
  goodreads: async (isbn) => (await goodreadsPage(isbn))?.match(/og:image" content="([^"]+)"/)?.[1],
  openlibrary: async (isbn) => `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false`,
};

// The height the page needs for a sharp cover; below it, a photo of the copy is better.
export const SHARP_HEIGHT = 800;

export type Candidate = FoundCover & {
  width: number;
  height: number;
  /** What's wrong with it, if anything — shown to the model and to Nehal. */
  problems: string[];
};

function problemsWith(width: number, height: number) {
  const problems: string[] = [];
  if (height < SHARP_HEIGHT) problems.push(`low resolution (${height}px tall; ${SHARP_HEIGHT}px+ looks sharp)`);
  const aspect = width / height;
  // Real covers sit around 0.6–0.75 wide-to-tall; outside that it's usually a crop, a spread, or a padded mock-up.
  if (aspect < 0.5 || aspect > 0.85) problems.push(`unusual shape (${width}×${height}) — may be cropped, a spread, or a mock-up`);
  return problems;
}

export async function fetchImage(url: string): Promise<Buffer | null> {
  const res = await get(url);
  if (!res) return null;
  const buf = Buffer.from(await res.arrayBuffer());
  const meta = await sharp(buf).metadata().catch(() => null);
  return meta?.height && meta.height >= MIN_HEIGHT ? buf : null;
}

async function candidateFrom(source: string, sourceUrl: string): Promise<Candidate | null> {
  const buf = await fetchImage(sourceUrl);
  if (!buf) return null;
  const { width = 0, height = 0 } = await sharp(buf).metadata();
  return { buf, source, sourceUrl, width, height, problems: problemsWith(width, height) };
}

/** Every source's cover for this ISBN, in source order. */
export async function findCovers(isbn: string): Promise<Candidate[]> {
  const found = await Promise.all(
    COVER_SOURCES.map(async (source) => {
      const url = await COVER_URL[source](isbn).catch(() => null);
      return url ? candidateFrom(source, url) : null;
    }),
  );
  return found.filter((c): c is Candidate => c !== null);
}

/** The candidate to use when the model doesn't choose: the first without problems, else the tallest. */
export function bestCover(candidates: Candidate[]): Candidate | null {
  return candidates.find((c) => c.problems.length === 0) ?? [...candidates].sort((a, b) => b.height - a.height)[0] ?? null;
}

export async function coverFromUrl(url: string): Promise<Candidate | null> {
  return candidateFrom("url", url);
}

/** A small JPEG of a cover, for showing a candidate to the model. */
export async function preview(buf: Buffer) {
  const small = await sharp(buf).resize({ height: 480, withoutEnlargement: true }).jpeg({ quality: 78 }).toBuffer();
  const { width, height } = await sharp(buf).metadata();
  return { base64: small.toString("base64"), width: width ?? 0, height: height ?? 0 };
}

export async function storeCover(id: string, buf: Buffer, source: string, sourceUrl: string | null) {
  const master = await sharp(buf).rotate().resize({ height: MASTER_HEIGHT, withoutEnlargement: true }).jpeg({ quality: 86, mozjpeg: true }).toBuffer();
  const img = sharp(master);
  const { width, height } = await img.metadata();
  const { dominant } = await img.stats();
  const color = "#" + [dominant.r, dominant.g, dominant.b].map((c) => c.toString(16).padStart(2, "0")).join("");
  // Content-addressed, so a replaced cover gets a new URL and never serves stale from a CDN.
  const hash = crypto.createHash("sha1").update(master).digest("hex").slice(0, 8);
  const blob = await put(`books/covers/${id}-${hash}.jpg`, master, {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "image/jpeg",
  });
  return {
    cover_url: blob.url,
    cover_width: width ?? null,
    cover_height: height ?? null,
    cover_color: color,
    cover_source: source,
    cover_source_url: sourceUrl,
    cover_rejected: null,
  };
}

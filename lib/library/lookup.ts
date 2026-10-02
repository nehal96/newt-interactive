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

export async function lookupDetails(isbn: string): Promise<Details> {
  const [olRes, firstRes, grRes] = await Promise.all([
    get(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`),
    get(`https://openlibrary.org/search.json?isbn=${isbn}&fields=first_publish_year`),
    get(`https://www.goodreads.com/book/isbn/${isbn}`),
  ]);
  const ol = (await olRes?.json().catch(() => null))?.[`ISBN:${isbn}`];
  const first = (await firstRes?.json().catch(() => null))?.docs?.[0];
  const gr = await grRes?.text().catch(() => undefined);
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

const COVER_SOURCES: Record<string, (isbn: string) => Promise<string | null | undefined>> = {
  amazon: async (isbn) => {
    const i10 = isbn10(isbn);
    return i10 && `https://images-na.ssl-images-amazon.com/images/P/${i10}.01._SCRMZZZZZZ_.jpg`;
  },
  goodreads: async (isbn) => {
    const html = await (await get(`https://www.goodreads.com/book/isbn/${isbn}`))?.text();
    return html?.includes(isbn) ? html.match(/og:image" content="([^"]+)"/)?.[1] : null;
  },
  openlibrary: async (isbn) => `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false`,
};

export async function fetchImage(url: string): Promise<Buffer | null> {
  const res = await get(url);
  if (!res) return null;
  const buf = Buffer.from(await res.arrayBuffer());
  const meta = await sharp(buf).metadata().catch(() => null);
  return meta?.height && meta.height >= MIN_HEIGHT ? buf : null;
}

export async function findCover(isbn: string): Promise<FoundCover | null> {
  for (const [source, resolve] of Object.entries(COVER_SOURCES)) {
    const sourceUrl = await resolve(isbn).catch(() => null);
    const buf = sourceUrl && (await fetchImage(sourceUrl));
    if (buf) return { buf, source, sourceUrl };
  }
  return null;
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

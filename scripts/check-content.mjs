// Invariants that fail silently: a piece with no catalogue row is a piece
// search engines never see, an og card that was never generated 404s in every
// share preview, and a canonical on the apex points at a 308.

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const problems = [];
const fail = (msg) => problems.push(msg);

const walk = (dir, out = []) => {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name.startsWith(".")) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
};

const sources = walk("pages")
  .concat(walk("lib"), walk("ui"), walk("viz"))
  .filter((f) => /\.(ts|tsx|mdx|js)$/.test(f));

const routeFiles = walk("pages").filter((f) => /\.page\.(mdx|tsx)$/.test(f));

// ── routes ↔ catalogue ────────────────────────────────────────────────────
const NOT_A_PIECE = new Set([
  "/_app", "/_document", "/404", "/og-card", "/feed.xml", "/sitemap.xml", "/",
]);

const hrefForRoute = (file) =>
  "/" + relative("pages", file).replace(/\.page\.(mdx|tsx)$/, "").replace(/\/?index$/, "");

const routeHrefs = routeFiles
  .map(hrefForRoute)
  .map((h) => (h === "//" || h === "" ? "/" : h))
  .filter((h) => !NOT_A_PIECE.has(h) && !h.startsWith("/api"));

// Only a meta.ts that lib/content.ts imports counts: a piece can hold a
// perfectly good meta.ts and still be invisible to the homepage and sitemap.
const contentText = readFileSync("lib/content.ts", "utf8");
const importedMetas = [
  ...contentText.matchAll(/from\s+"\.\.\/(pages\/[^"]+\/meta)"/g),
].map((m) => `${m[1]}.ts`);

const catalogueText = [
  contentText,
  ...importedMetas.map((f) => readFileSync(f, "utf8")),
].join("\n");

const catalogueHrefs = new Set(
  [...catalogueText.matchAll(/href:\s*"([^"]+)"/g)].map((m) => m[1])
);

for (const href of routeHrefs) {
  if (!catalogueHrefs.has(href)) {
    fail(`${href} has no row in lib/content.ts — the homepage, sitemap and feed will all miss it.`);
  }
}
for (const href of catalogueHrefs) {
  if (!routeHrefs.includes(href)) {
    fail(`lib/content.ts lists ${href}, but no ${href.slice(1)}/index.page.* exists.`);
  }
}

// ── every motif has a rendered og card ────────────────────────────────────
const motifs = [
  ...readFileSync("lib/motifs.ts", "utf8").matchAll(/^\s+\| "([^"]+)"/gm),
].map((m) => m[1]);

for (const motif of motifs) {
  if (!existsSync(join("public/images/og", `${motif}.png`))) {
    fail(`motif "${motif}" has no public/images/og/${motif}.png — run node scripts/og-cards.mjs.`);
  }
}

// ── canonical host ────────────────────────────────────────────────────────
for (const file of sources) {
  const text = readFileSync(file, "utf8");
  for (const m of text.matchAll(/https:\/\/([\w.-]*)newtinteractive\.com/g)) {
    if (m[1] !== "www.") {
      fail(`${file} points at ${m[0]} — the apex 308s to www, so this is a redirect.`);
    }
  }
}

// ── a page states its metadata ────────────────────────────────────────────
for (const file of routeFiles) {
  const href = hrefForRoute(file);
  if (NOT_A_PIECE.has(href) || href.startsWith("/api")) continue;
  // MDX exports it; a hand-built page may keep it local and pass it to MdxLayout.
  const text = readFileSync(file, "utf8");
  if (!/(export\s+(const|\{)\s*metadata|const\s+metadata\s*=)/.test(text)) {
    fail(`${file} declares no metadata — SeoHead will render an untitled page.`);
  }
}

if (problems.length) {
  for (const p of problems) console.error(`  FAIL   ${p}`);
  console.error(`\n${problems.length} content problem(s).`);
  process.exit(1);
}

console.log(`content ok — ${routeHrefs.length} pieces, ${motifs.length} motifs.`);

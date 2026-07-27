// Homepage covers, captured from the pieces themselves.
//
// The homepage index doesn't use stock art: each cover is a still of one of
// that piece's own interactives, shot from the live page. That's why the
// covers agree with each other — they're all the real thing, already drawn in
// the project's own colours.
//
// Reuses the headless-Chrome core from scripts/article-export/capture.mjs
// (software GL, so WebGL canvases composite into screenshots — see the note at
// the top of that file). The article exporter can only see pieces that render
// as <figure>; only the hemoglobin essay does, so everything older is targeted
// by an ordinary CSS selector instead.
//
//   npm run dev
//   node scripts/covers.mjs                 # every piece
//   node scripts/covers.mjs dna c1-ffl      # just these
//   node scripts/covers.mjs --base-url http://127.0.0.1:3456
//
// Two files per piece, both 16:9:
//   public/images/covers/<slug>.png        1600×900, whole figure, paper ground
//   public/images/covers/<slug>-thumb.png   600×338, cropped to the busiest
//                                           part, so it still reads at 144px

import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  launchChrome,
  Page,
  prepareFigure,
  READINESS_HELPERS,
} from "./article-export/capture.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT_DIR = path.join(ROOT, "public/images/covers");
const PLATE = "#ffffff";
const WIDE = { width: 1600, height: 900 };
const THUMB = { width: 600, height: 338 };

// Interactive furniture that shouldn't appear in a cover: zoom controls, the
// React Flow watermark, figure captions, the tab strips on toggle figures.
// A cover should read as the drawing, not as a screenshot of an app.
const HIDE_CHROME = `
  .react-flow__attribution,
  .react-flow__controls,
  .react-flow__panel,
  .react-flow__minimap,
  figcaption { display: none !important; }
`;

// One entry per homepage row. `target` is either a <figure> index (hemoglobin,
// the only piece that renders figures) or a CSS selector; without an explicit
// `nth` the largest match wins, which is nearly always the main drawing.
// `actions` runs first, for interactives that start empty.
const COVERS = [
  {
    slug: "hemoglobin",
    path: "/essays/hemoglobin",
    // Figure 10 is the T↔R switch; `inner` drops its card and tab strip and
    // keeps the drawing.
    target: { figure: 10, inner: "svg" },
  },
  {
    slug: "systems-biology",
    // The series index is a table of contents; take the cover from a part.
    path: "/series/systems-biology/transcription-network-basics-3",
    target: { selector: "svg" },
  },
  { slug: "c1-ffl", path: "/blocks/c1-ffl", target: { selector: ".react-flow" } },
  {
    slug: "circuit-evolution",
    path: "/blocks/circuit-evolution",
    target: { selector: ".react-flow" },
  },
  {
    slug: "erdos-renyi-graph",
    path: "/blocks/erdos-renyi-graph",
    // The canvas starts empty — draw a graph before shooting it.
    actions: [{ clickText: "Generate Network", wait: 1600 }],
    target: { selector: ".react-flow" },
  },
  {
    slug: "robot-localization",
    path: "/blocks/robot-localization",
    target: { selector: "table[class*='grid']" },
  },
  { slug: "dna", path: "/blocks/dna", target: { selector: "canvas" } },
  {
    slug: "kalman-filters",
    path: "/blocks/kalman-filters",
    // The tutorial opens on bare axes; walk it to the slide where prior,
    // measurement and posterior are all on the chart.
    actions: [
      { clickText: "Next", wait: 500 },
      { clickText: "Next", wait: 500 },
      { clickText: "Next", wait: 500 },
      { clickText: "Next", wait: 500 },
      { clickText: "Next", wait: 900 },
    ],
    target: { selector: "svg" },
  },
  {
    slug: "threejs-journey",
    path: "/notes/threejs-journey",
    target: { selector: "canvas", nth: 1 }, // the cameras scene
  },
];

// --- args -----------------------------------------------------------------

const argv = process.argv.slice(2);
// Positional args are slugs; anything consumed as a --flag value isn't one.
const consumed = new Set();
const flag = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  if (i === -1) return fallback;
  consumed.add(i).add(i + 1);
  return argv[i + 1];
};
const BASE_URL = flag("base-url", "http://127.0.0.1:3000");
const PORT = Number(flag("port", 9400));
const slugs = argv.filter((a, i) => !consumed.has(i) && !a.startsWith("--"));
const wanted = COVERS.filter(
  (c) => slugs.length === 0 || slugs.includes(c.slug)
);

// --- capture --------------------------------------------------------------

async function applyActions(page, actions = []) {
  for (const { clickText, wait = 1000 } of actions) {
    const hit = await page.eval(`(() => {
      const t = ${JSON.stringify(clickText)}.toLowerCase();
      const el = [...document.querySelectorAll("button")]
        .find(b => (b.textContent || "").toLowerCase().includes(t));
      if (!el) return false;
      el.click();
      return true;
    })()`);
    if (!hit) throw new Error(`no button matching "${clickText}"`);
    await page.eval(`new Promise(r => setTimeout(r, ${wait}))`);
  }
}

async function hideChrome(page) {
  await page.eval(`(() => {
    const s = document.createElement("style");
    s.textContent = ${JSON.stringify(HIDE_CHROME)};
    document.head.appendChild(s);
  })()`);
}

// Scroll a selector-targeted element into view, wait for any canvas inside it
// to have actually drawn, and return its page-space rect. With no `nth`, take
// the biggest match — a bare "svg" would otherwise pick up a 14px icon.
async function prepareSelector(page, { selector, nth }, waitMs = 15000) {
  const rect = await page.eval(`(async () => {
    ${READINESS_HELPERS}
    const all = [...document.querySelectorAll(${JSON.stringify(selector)})];
    const el = ${nth === undefined
      ? `all.sort((a, b) => {
          const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
          return rb.width * rb.height - ra.width * ra.height;
        })[0]`
      : `all[${nth}]`};
    if (!el) return null;
    el.scrollIntoView({ block: "center" });
    await sleep(400);
    const deadline = Date.now() + ${waitMs};
    while (Date.now() < deadline) {
      const canvases = [...el.querySelectorAll("canvas")];
      if (el.tagName === "CANVAS") canvases.push(el);
      if (canvases.length === 0 || canvases.every(hasContent)) break;
      await sleep(250);
    }
    await sleep(600);
    const r = el.getBoundingClientRect();
    return {
      x: r.left + window.scrollX,
      y: r.top + window.scrollY,
      width: r.width,
      height: r.height,
    };
  })()`);
  if (!rect) throw new Error(`no element matched "${selector}"`);
  if (rect.width < 120 || rect.height < 90)
    throw new Error(
      `"${selector}" matched only ${Math.round(rect.width)}×${Math.round(
        rect.height
      )} — wrong element?`
    );
  return rect;
}

// Narrow a target to the drawing inside it — the svg or canvas rather than the
// card, tab strip and caption that a figure wraps around it.
async function narrowToInner(page, rect, inner) {
  const found = await page.eval(`(() => {
    const inRect = (el) => {
      const r = el.getBoundingClientRect();
      const x = r.left + window.scrollX, y = r.top + window.scrollY;
      return x >= ${rect.x} - 2 && y >= ${rect.y} - 2 &&
             x + r.width <= ${rect.x + rect.width} + 2 &&
             y + r.height <= ${rect.y + rect.height} + 2;
    };
    const best = [...document.querySelectorAll(${JSON.stringify(inner)})]
      .filter(inRect)
      .sort((a, b) => {
        const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
        return rb.width * rb.height - ra.width * ra.height;
      })[0];
    if (!best) return null;
    const r = best.getBoundingClientRect();
    return {
      x: r.left + window.scrollX, y: r.top + window.scrollY,
      width: r.width, height: r.height,
    };
  })()`);
  return found || rect;
}

// Grow a rect by a margin, so the cover doesn't crop flush to the drawing.
const inflate = (r, m) => ({
  x: Math.max(0, r.x - m),
  y: Math.max(0, r.y - m),
  width: r.width + m * 2,
  height: r.height + m * 2,
});

async function renderCover(sharp, buf, slug) {
  // Figures carry a lot of their own padding; trimming it first means the
  // drawing fills the cover instead of floating in the middle of it.
  let trimmed = buf;
  try {
    trimmed = await sharp(buf)
      .trim({ background: PLATE, threshold: 6 })
      .png()
      .toBuffer();
  } catch {
    /* nothing to trim (dark 3D scenes) — use the capture as-is */
  }

  const wide = await sharp(trimmed)
    .resize({ ...WIDE, fit: "contain", background: PLATE })
    .png()
    .toBuffer();
  // The thumb is 160px wide in the index — a whole shrunk-down diagram turns to
  // mush at that size, so crop to the densest region instead of fitting.
  const thumb = await sharp(trimmed)
    .resize({ ...THUMB, fit: "cover", position: sharp.strategy.attention })
    .png()
    .toBuffer();
  await writeFile(path.join(OUT_DIR, `${slug}.png`), wide);
  await writeFile(path.join(OUT_DIR, `${slug}-thumb.png`), thumb);
  return { wide: wide.length, thumb: thumb.length };
}

// --- run ------------------------------------------------------------------

const sharp = (await import("sharp")).default;
await mkdir(OUT_DIR, { recursive: true });

const chrome = await launchChrome({ port: PORT });
let failures = 0;

for (const cover of wanted) {
  const url = BASE_URL + cover.path;
  let page;
  try {
    page = await Page.open(PORT, url);
    // Client-only interactives (react-flow, r3f) mount after hydration.
    await page.eval(`new Promise(r => setTimeout(r, 2000))`);
    await applyActions(page, cover.actions);
    await hideChrome(page);

    let rect =
      cover.target.figure !== undefined
        ? await prepareFigure(page, cover.target.figure)
        : await prepareSelector(page, cover.target);
    if (cover.target.inner)
      rect = await narrowToInner(page, rect, cover.target.inner);

    // A narrowed target sits just inside its card, so a wide margin would pull
    // that card's border back into the shot.
    const clip = inflate(rect, cover.target.inner ? 4 : 16);
    const sizes = await renderCover(sharp, await page.captureClip(clip), cover.slug);
    console.log(
      `✓ ${cover.slug.padEnd(20)} ${Math.round(rect.width)}×${Math.round(
        rect.height
      )} → ${Math.round(sizes.wide / 1024)}kb + ${Math.round(
        sizes.thumb / 1024
      )}kb thumb`
    );
  } catch (err) {
    failures++;
    console.log(`✗ ${cover.slug.padEnd(20)} ${err.message}`);
  } finally {
    page?.close();
  }
}

chrome.proc.kill();

// next/image keys its cache on the request URL, which doesn't change when a
// cover is re-shot — and it caches per output format, so a stale WebP can
// survive even after a fresh PNG is served. Drop the cache or you'll spend a
// while wondering why the page still shows the old capture.
for (const dir of [".next/dev/cache/images", ".next/cache/images"]) {
  await rm(path.join(ROOT, dir), { recursive: true, force: true });
}

console.log(
  failures ? `\n${failures} cover(s) failed.` : `\nAll ${wanted.length} covers written to public/images/covers/.`
);
process.exit(failures ? 1 : 0);

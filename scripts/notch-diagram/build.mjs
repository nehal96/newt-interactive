// source.svg -> the Notch deck's two "how it works" diagrams, one per scheme.
//
//   node scripts/notch-diagram/build.mjs   # → public/decks/notch/diagram{,-dark}.webp
//
// The export draws its labels in `foreignObject`, which browsers refuse to
// render through an `<img>`, so the deck takes rasters rather than the SVG.

import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";
import { launchChrome, Page } from "../article-export/capture.mjs";

const SRC = new URL("./source.svg", import.meta.url);
const HAND = new URL("./kalam-400.woff2", import.meta.url);
const OUT = new URL("../../public/decks/notch/", import.meta.url);

// The tldraw viewBox, and a raster that must stay wide enough to cover the
// deck's column at 2x.
const FRAME = { width: 1027, height: 661 };
const RASTER_WIDTH = 1600;

// Every edit below is keyed to a literal tldraw emits. A re-export that changes
// any of them must fail here rather than ship silently unstyled art.
const swap = (svg, from, to) => {
  if (!svg.includes(from)) {
    throw new Error(`source.svg no longer contains ${from} — re-derive this edit`);
  }
  return svg.replaceAll(from, to);
};

// Kalam is the app's handwriting, so it is the diagram's too. Vendored beside
// this script rather than fetched: the raster must build the same offline.
const hand = await readFile(HAND);
const KALAM = `@font-face {
  font-family: "kalam";
  font-weight: normal;
  src: url("data:font/woff2;base64,${hand.toString("base64")}") format("woff2");
}
`;

const prepare = (svg) => {
  svg = swap(svg, "<defs><style>", `<defs><style>${KALAM}`);
  svg = swap(svg, "font-family: tldraw_draw, sans-serif", "font-family: kalam, cursive");

  // Kalam's x-height sits below the face it replaced, so the whiteboard's
  // movement lines lost their footing. Scaling the group, not the font-size,
  // keeps the fixed-width foreignObject from rewrapping them.
  svg = swap(
    svg,
    "matrix(1, 0, 0, 1, 227.9417, 258.3613) scale(0.4190403245051744, 0.4190403245051744)",
    "matrix(1, 0, 0, 1, 227.9417, 258.3613) scale(0.48, 0.48)"
  );

  // The whiteboard is an unfilled black outline, which only reads as a
  // whiteboard over a white page. The deck's page is navy half the time.
  svg = swap(svg, 'fill="none" stroke="#1d1d1d"', 'fill="#ffffff" stroke="#9fa8b2"');
  svg = swap(svg, '<path stroke-width="5"', '<path stroke-width="6"');

  // Square corners on the screenshot's crop land as a hard rectangle once the
  // art sits on the dark scheme.
  return swap(
    svg,
    '<polygon points="0,0 377.53975942726066,0 377.53975942726066,312.42629502014205 0,312.42629502014205"/>',
    '<rect x="0" y="0" width="377.53975942726066" height="312.42629502014205" rx="14" ry="14"/>'
  );
};

// tldraw's ink, dim, panel fill and label halo, in both the attribute and the
// inline-style spelling it emits for each.
const DARK = [
  [/#1d1d1d/g, "#e9edfd"],
  [/rgb\(29, 29, 29\)/g, "rgb(233, 237, 253)"],
  [/#eceef0/g, "#061245"],
  [/#9fa8b2/g, "#8791c6"],
  [/rgb\(159, 168, 178\)/g, "rgb(135, 145, 198)"],
  [/rgb\(249, 250, 251\)/g, "rgb(0, 8, 50)"],
];

// The whiteboard — box, then its two labels — leads the document, and keeps its
// light-scheme ink in both files now that the box is filled white.
const darken = (svg) => {
  const label = svg.indexOf("10 toes to bar");
  const end = label === -1 ? -1 : svg.indexOf("</g>", svg.indexOf("</foreignObject>", label));
  if (end === -1) {
    throw new Error("whiteboard group not found — re-derive the split in darken()");
  }
  const split = end + 4;
  return (
    svg.slice(0, split) +
    DARK.reduce((s, [re, to]) => s.replace(re, to), svg.slice(split))
  );
};

const svg = prepare(await readFile(SRC, "utf8"));
const variants = [
  { name: "diagram", svg },
  { name: "diagram-dark", svg: darken(svg) },
];

const server = createServer((req, res) => {
  const hit = variants.find((v) => req.url === `/${v.name}.svg`);
  res.writeHead(hit ? 200 : 404, { "content-type": "image/svg+xml" });
  res.end(hit ? hit.svg : "");
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const origin = `http://127.0.0.1:${server.address().port}`;

const chrome = await launchChrome({ port: 9233 });
try {
  await Promise.all(
    variants.map(async (variant) => {
      const page = await Page.open(chrome.port, `${origin}/${variant.name}.svg`);
      await page.cdp.send("Emulation.setDeviceMetricsOverride", {
        ...FRAME,
        deviceScaleFactor: 2,
        mobile: false,
      });
      // The deck sits the art straight on the section, no plate.
      await page.cdp.send("Emulation.setDefaultBackgroundColorOverride", {
        color: { r: 0, g: 0, b: 0, a: 0 },
      });
      await new Promise((r) => setTimeout(r, 1500));

      const { data } = await page.cdp.send("Page.captureScreenshot", {
        format: "png",
        captureBeyondViewport: true,
        clip: { x: 0, y: 0, ...FRAME, scale: 2 },
      });

      const buf = await sharp(Buffer.from(data, "base64"))
        .resize({ width: RASTER_WIDTH, kernel: "lanczos3" })
        .webp({ quality: 90, alphaQuality: 100 })
        .toBuffer();

      await writeFile(new URL(`${variant.name}.webp`, OUT), buf);
      console.log(`${variant.name}.webp — ${Math.round(buf.length / 1024)} kB`);
      await page.close?.();
    })
  );
} finally {
  chrome.proc?.kill();
  server.close();
}

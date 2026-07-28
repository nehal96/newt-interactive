// Rasterise every CoverArt motif to a 1200x630 social card.
//
//   npm run dev                       # the page this shoots is /og-card
//   node scripts/og-cards.mjs         # → public/images/og/<motif>.png

import { mkdir, writeFile } from "node:fs/promises";
import { launchChrome, Page } from "./article-export/capture.mjs";

const CARD = { width: 1200, height: 630 };
const OUT_DIR = new URL("../public/images/og/", import.meta.url);

const arg = (flag, fallback) => {
  const i = process.argv.indexOf(flag);
  return i === -1 ? fallback : process.argv[i + 1];
};

const origin = arg("--origin", "http://localhost:3000");

const chrome = await launchChrome({ port: 9223 });
let page;

try {
  page = await Page.open(chrome.port, `${origin}/og-card`);

  // Every card must sit inside the viewport: captureBeyondViewport composites
  // in tiles and leaves a faint seam where the viewport edge falls.
  await page.cdp.send("Emulation.setDeviceMetricsOverride", {
    width: CARD.width,
    height: await page.eval("document.documentElement.scrollHeight"),
    deviceScaleFactor: 1,
    mobile: false,
  });

  const cards = await page.eval(`
    [...document.querySelectorAll("[data-motif]")].map((el) => {
      const r = el.getBoundingClientRect();
      return {
        motif: el.dataset.motif,
        x: r.x + scrollX,
        y: r.y + scrollY,
        width: r.width,
        height: r.height,
      };
    })
  `);

  if (!cards?.length) {
    throw new Error(`No [data-motif] cards found at ${origin}/og-card`);
  }

  await mkdir(OUT_DIR, { recursive: true });

  for (const { motif, ...clip } of cards) {
    if (clip.width !== CARD.width || clip.height !== CARD.height) {
      throw new Error(
        `${motif} laid out at ${clip.width}x${clip.height}, expected ${CARD.width}x${CARD.height}`
      );
    }
    const buf = await page.captureClip(clip);
    const file = new URL(`${motif}.png`, OUT_DIR);
    await writeFile(file, buf);
    console.log(`${motif}.png  ${(buf.length / 1024).toFixed(1)} KB`);
  }

  console.log(`\n${cards.length} cards → public/images/og/`);
} finally {
  page?.close();
  chrome.proc.kill();
}

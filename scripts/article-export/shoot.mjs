// Capture every figure in an essay's manifest by driving a headless dev-server
// page, then fold the rendered figcaptions back into the doc's alt text.

import fs from "node:fs";
import path from "node:path";
import { launchChrome, Page, discoverFigures, captureFigure } from "./capture.mjs";

export async function shootFigures({
  route,
  figures,
  outDir,
  baseUrl = "http://localhost:3000",
  port = 9222,
  pad = 28,
  maxWidth = 1400,
  log = () => {},
}) {
  const url = baseUrl.replace(/\/$/, "") + route;
  const res = await fetch(url).catch(() => null);
  if (!res || !res.ok) {
    throw new Error(
      `Dev server not reachable at ${url}. Start it first (e.g. \`npm run dev\`).`
    );
  }
  fs.mkdirSync(outDir, { recursive: true });

  log(`launching headless Chrome…`);
  const { proc, port: p } = await launchChrome({ port });
  let page;
  try {
    page = await Page.open(p, url);
    const found = await discoverFigures(page);
    if (found.length !== figures.length) {
      log(`⚠ figure count mismatch — DOM has ${found.length}, manifest ${figures.length}. Capturing by index.`);
    }
    for (const fig of figures) {
      const meta = found[fig.index];
      const { buf, kind } = await captureFigure(page, fig.index, {
        pad, maxWidth, frame: fig.frame,
      });
      fs.writeFileSync(path.join(outDir, fig.file), buf);
      fig.caption = meta?.caption || null;
      fig.kind = kind; // detected post-boot, so lazy 3D figures read correctly
      fig.bytes = buf.length;
      log(`  ✓ ${fig.file}  [${fig.kind}]  ${(buf.length / 1024).toFixed(0)} KB`);
    }
  } finally {
    page?.close();
    proc.kill();
  }
  return figures;
}

// Prefer an explicit override, else the rendered figcaption, else the
// provisional alt the extractor guessed. Matches placeholders by filename.
export function linkCaptions(markdown, figures, overrides = {}) {
  const byFile = new Map(figures.map((f) => [f.file, f]));
  return markdown
    .split("\n")
    .map((line) => {
      const m = /^> \*\*\[Image — `([^`]+)`\]\*\* /.exec(line);
      if (!m) return line;
      const fig = byFile.get(m[1]);
      if (!fig) return line;
      const ov = overrides.figures?.[m[1]] || {};
      const alt = ov.alt || fig.caption || fig.alt;
      return `> **[Image — \`${m[1]}\`]** ${alt}`;
    })
    .join("\n");
}

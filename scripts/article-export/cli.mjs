#!/usr/bin/env node
// article-export — turn an interactive newt essay into a Substack-ready
// markdown doc plus a folder of static figure screenshots.
//
//   node scripts/article-export/cli.mjs <command> <essay-slug> [flags]
//
// Commands:
//   extract  MDX -> markdown doc + figures.json manifest (no browser)
//   shoot    screenshot every figure listed in the manifest (needs dev server)
//   all      extract, shoot, then link captions into the doc (the usual one)
//   link     re-apply captions/overrides to the doc from the manifest (no browser)
//
// Flags:
//   --out <dir>        output dir (default docs/<slug>/export)
//   --base-url <url>   dev server (default http://localhost:3000)
//   --pad <px>         white margin around each figure (default 28)
//   --max-width <px>   downscale cap (default 1400)
//   --port <n>         Chrome debug port (default 9222)

import fs from "node:fs";
import path from "node:path";
import { extractEssay, loadOverrides } from "./extract.mjs";
import { shootFigures, linkCaptions } from "./shoot.mjs";

function parseFlags(args) {
  const o = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith("--")) o[args[i].slice(2)] = args[i + 1], i++;
  }
  return o;
}

const [cmd, slug, ...rest] = process.argv.slice(2);
if (!cmd || !slug || cmd === "--help") {
  console.log(
    "usage: node scripts/article-export/cli.mjs <extract|shoot|all> <essay-slug> [--out dir] [--base-url url] [--pad px] [--max-width px]"
  );
  process.exit(cmd ? 0 : 1);
}

const flags = parseFlags(rest);
const root = process.cwd();
const outDir = path.resolve(flags.out || path.join("docs", slug, "export"));
const figuresDir = path.join(outDir, "figures");
const docPath = path.join(outDir, "essay.md");
const manifestPath = path.join(outDir, "figures.json");
const shootOpts = {
  outDir: figuresDir,
  baseUrl: flags["base-url"] || "http://localhost:3000",
  port: Number(flags.port || 9222),
  pad: Number(flags.pad || 28),
  maxWidth: Number(flags["max-width"] || 1400),
  log: (m) => console.log(m),
};

function writeManifest(figures, route) {
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(manifestPath, JSON.stringify({ slug, route, figures }, null, 2) + "\n");
}

async function main() {
  if (cmd === "extract" || cmd === "all") {
    const { markdown, figures, route } = extractEssay(slug, { repoRoot: root });
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(docPath, markdown);
    writeManifest(figures, route);
    console.log(`extracted → ${path.relative(root, docPath)} (${figures.length} figures)`);
    if (cmd === "extract") return;

    const shot = await shootFigures({ route, figures, ...shootOpts });
    const linked = linkCaptions(markdown, shot, loadOverrides(root, slug));
    fs.writeFileSync(docPath, linked);
    writeManifest(shot, route);
    console.log(`\ndone → ${path.relative(root, outDir)}/  (doc + ${shot.length} figures)`);
    return;
  }

  if (cmd === "shoot") {
    if (!fs.existsSync(manifestPath)) {
      console.error(`No manifest at ${manifestPath}. Run \`extract\` first.`);
      process.exit(1);
    }
    const { route, figures } = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    const shot = await shootFigures({ route, figures, ...shootOpts });
    writeManifest(shot, route);
    // refresh captions in an existing doc if present
    if (fs.existsSync(docPath)) {
      const linked = linkCaptions(fs.readFileSync(docPath, "utf8"), shot, loadOverrides(root, slug));
      fs.writeFileSync(docPath, linked);
    }
    console.log(`\nshot ${shot.length} figures → ${path.relative(root, figuresDir)}/`);
    return;
  }

  if (cmd === "link") {
    if (!fs.existsSync(manifestPath) || !fs.existsSync(docPath)) {
      console.error(`Need an existing ${path.relative(root, docPath)} + manifest. Run \`all\` first.`);
      process.exit(1);
    }
    const { figures } = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    const linked = linkCaptions(fs.readFileSync(docPath, "utf8"), figures, loadOverrides(root, slug));
    fs.writeFileSync(docPath, linked);
    console.log(`relinked alt text → ${path.relative(root, docPath)}`);
    return;
  }

  console.error(`unknown command: ${cmd}`);
  process.exit(1);
}

main().catch((e) => {
  console.error("error:", e.message || e);
  process.exit(1);
});

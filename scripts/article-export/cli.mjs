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
//   record   record figures as looping GIFs — one ad-hoc, or a whole essay's
//            recordings.json manifest (needs dev server + ffmpeg)
//
// Flags (extract/shoot/all):
//   --out <dir>        output dir (default docs/<slug>/export)
//   --base-url <url>   dev server (default http://localhost:3000)
//   --pad <px>         white margin around each figure (default 28)
//   --max-width <px>   downscale cap (default 1400)
//   --port <n>         Chrome debug port (default 9222)
//
// Flags (record):
//   (no target)        batch: produce every entry in pages/essays/<slug>/recordings.json
//   --only <name>      batch: produce just the manifest entry with this name
//   --out <file>       output GIF path (default docs/<slug>/export/figures/<name>.gif)
//   --name <basename>  basename for the default --out path (default "recording")
//   --figure <sel>     which figure: index, "first-player" (default), or caption substring
//   --fps <n>          GIF frame rate (default 20)
//   --frames <n>       scrub mode: sample N frames across the morph (default all)
//   --max-width <px>   downscale cap (default 800)
//   --pad <px>         white margin (default 28, matches the screenshot)
//   --settle <ms>      per-step wait (default 500 scrub / 80 tween)
//   --start-hold <ms>  freeze on the opening pose (default 600)
//   --end-hold <ms>    freeze on the closing/R pose (default 900)
//   --no-play-icon     scrub mode: don't force the play/pause/replay glyph
//   --sweep <list>     slider chart: comma-separated checkpoints (values or preset
//                      labels, e.g. "lungs,resting tissue,working muscle")
//   --checkpoint-hold <ms>  pause at each sweep checkpoint (default 1000)
//   --sweep-rate <n>   slider units/sec between checkpoints (default 45)
//   --no-loop-back     sweep mode: don't sweep back to the first checkpoint
//   --keep-frames      keep the intermediate PNG frames next to the GIF
//   --base-url <url>   dev server (default http://localhost:3000)
//   --port <n>         Chrome debug port (default 9223)

import fs from "node:fs";
import path from "node:path";
import { extractEssay, loadOverrides } from "./extract.mjs";
import { shootFigures, linkCaptions } from "./shoot.mjs";
import { recordFigure } from "./record.mjs";
import { RULES } from "./rules.mjs";

function parseFlags(args) {
  const o = {};
  for (let i = 0; i < args.length; i++) {
    if (!args[i].startsWith("--")) continue;
    const key = args[i].slice(2);
    const next = args[i + 1];
    // A flag with no value (end of args or followed by another flag) is boolean.
    if (next === undefined || next.startsWith("--")) o[key] = true;
    else (o[key] = next), i++;
  }
  return o;
}

const [cmd, slug, ...rest] = process.argv.slice(2);
if (!cmd || !slug || cmd === "--help") {
  console.log(
    "usage: node scripts/article-export/cli.mjs <extract|shoot|all|record> <essay-slug> [flags]\n" +
      "  record (batch):  record <slug>            # all of pages/essays/<slug>/recordings.json\n" +
      "  record (one):    record <slug> --figure <sel> --name <basename> [--sweep ...]"
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

  if (cmd === "record") {
    const route = flags.route || RULES.routeFor(slug);
    // Settings shared by every recording in this run; per-recording specs layer
    // on top. base-url/port apply to both single and batch.
    const common = {
      route,
      baseUrl: flags["base-url"] || "http://localhost:3000",
      port: Number(flags.port || 9223),
      keepFrames: !!flags["keep-frames"],
      log: (m) => console.log(m),
    };
    // A "spec" uses recordFigure's own option names (figure, sweep, fps, …) plus
    // name/out; config entries are specs verbatim, and CLI flags map to one.
    const runRecording = (spec) => {
      const outFile = spec.out
        ? path.resolve(spec.out)
        : path.join(figuresDir, `${spec.name || "recording"}.gif`);
      return recordFigure({ ...common, ...spec, outFile });
    };

    // Single ad-hoc recording when a target is named on the CLI.
    if (flags.figure || flags.name || flags.sweep || flags.out) {
      const result = await runRecording({
        name: flags.name,
        out: flags.out,
        figure: flags.figure || "first-player",
        frames: flags.frames ? Number(flags.frames) : null,
        fps: flags.fps ? Number(flags.fps) : undefined,
        startHoldMs: flags["start-hold"] != null ? Number(flags["start-hold"]) : undefined,
        endHoldMs: flags["end-hold"] != null ? Number(flags["end-hold"]) : undefined,
        pad: flags.pad ? Number(flags.pad) : undefined,
        maxWidth: flags["max-width"] ? Number(flags["max-width"]) : undefined,
        settle: flags.settle != null ? Number(flags.settle) : null,
        playIcon: !flags["no-play-icon"],
        sweep: flags.sweep
          ? String(flags.sweep).split(",").map((s) => s.trim()).filter(Boolean)
          : null,
        checkpointHoldMs: flags["checkpoint-hold"] != null ? Number(flags["checkpoint-hold"]) : undefined,
        sweepRate: flags["sweep-rate"] != null ? Number(flags["sweep-rate"]) : undefined,
        loopBack: !flags["no-loop-back"],
      });
      console.log(`\ndone → ${path.relative(root, result.outFile)}  (${result.frames} frames)`);
      return;
    }

    // Otherwise: batch — produce every recording in the essay's manifest.
    const cfgPath = path.join(root, "pages/essays", slug, "recordings.json");
    if (!fs.existsSync(cfgPath)) {
      console.error(
        `No target given and no manifest at ${path.relative(root, cfgPath)}.\n` +
          `Record one figure with --figure/--name/--sweep, or add a recordings.json.`
      );
      process.exit(1);
    }
    const cfg = JSON.parse(fs.readFileSync(cfgPath, "utf8"));
    let entries = cfg.recordings || [];
    if (flags.only) entries = entries.filter((e) => e.name === flags.only);
    if (!entries.length) {
      console.error(
        flags.only ? `No recording named "${flags.only}" in the manifest.` : `Manifest has no recordings.`
      );
      process.exit(1);
    }
    console.log(`recording ${entries.length} figure(s) from ${path.relative(root, cfgPath)}…`);
    for (const e of entries) {
      console.log(`\n▶ ${e.name}`);
      await runRecording({ ...(cfg.defaults || {}), ...e });
    }
    console.log(`\ndone → ${entries.length} GIF(s) → ${path.relative(root, figuresDir)}/`);
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

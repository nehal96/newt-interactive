// An iPhone screen recording → a looping clip for a deck's phone mock.
//
//   node scripts/deck-video.mjs hero ~/Downloads/ScreenRecording.mov --in 0.4 --out 11.2
//
// Writes public/decks/<deck>/<slot>.mp4 and .webp.

import { execFileSync } from "node:child_process";
import { mkdirSync, statSync } from "node:fs";
import { join } from "node:path";

const FFMPEG = process.env.FFMPEG_BIN || "ffmpeg";
const FFPROBE = process.env.FFPROBE_BIN || "ffprobe";

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1];
};
const has = (name) => args.includes(`--${name}`);

const VALUED = new Set(["deck", "in", "out", "width", "crf", "poster", "mask", "cut"]);
const positional = [];
for (let i = 0; i < args.length; i++) {
  if (!args[i].startsWith("--")) {
    positional.push(args[i]);
  } else if (VALUED.has(args[i].slice(2))) {
    i++;
  }
}
const [slot, input] = positional;

if (!slot || !input) {
  console.error("usage: deck-video.mjs <slot> <input> [--deck notch] [--in S] [--out S]");
  console.error("       [--cut a:b ...] [--width 620] [--crf 26] [--poster S]");
  console.error("       [--keep-dot] [--mask x,y,w,h[,rrggbb] ...]");
  process.exit(1);
}

const deck = flag("deck", "notch");
const width = Number(flag("width", 620));
const crf = Number(flag("crf", 26));
const start = flag("in", null);
const end = flag("out", null);

const outDir = join("public", "decks", deck);
mkdirSync(outDir, { recursive: true });
const mp4 = join(outDir, `${slot}.mp4`);
const webp = join(outDir, `${slot}.webp`);

const run = (bin, argv) =>
  execFileSync(bin, argv, { encoding: "buffer", maxBuffer: 1 << 30 });

const probe = (entries) =>
  run(FFPROBE, [
    "-v", "error", "-select_streams", "v:0",
    "-show_entries", entries, "-of", "default=noprint_wrappers=1",
    input,
  ]).toString().trim();

const meta = Object.fromEntries(
  probe("stream=width,height,color_range").split("\n").map((l) => l.split("="))
);
const srcW = Number(meta.width);
const srcH = Number(meta.height);
// iPhone recordings come out full-range; encoding as limited without saying so
// turns every white in the app grey.
const fullRange = meta.color_range === "pc";

// --cut a:b, repeatable — splices segments together, for recordings whose
// middle is a spinner. Applied as a filter, so -ss/-to must stay out of it.
const cuts = args
  .filter((a, i) => args[i - 1] === "--cut")
  .map((s) => s.split(":").map(Number));

const trim = [];
if (!cuts.length) {
  if (start !== null) trim.push("-ss", String(start));
  if (end !== null) trim.push("-to", String(end));
}

const probeAt = cuts.length ? cuts[0][0] : start;

/* The screen-recording indicator is a red dot inside the Dynamic Island. The
   island is pure black, so a black patch over the dot is invisible — provided
   it stays within the stadium, which is what the inset below guarantees. */
function findDotMask() {
  const band = Math.round(srcH * 0.09);
  const raw = run(FFMPEG, [
    "-v", "error", ...(probeAt !== null ? ["-ss", String(probeAt)] : []),
    "-i", input, "-frames:v", "1",
    "-vf", `crop=${srcW}:${band}:0:0`,
    "-pix_fmt", "rgb24", "-f", "rawvideo", "-",
  ]);

  const at = (x, y) => {
    const i = (y * srcW + x) * 3;
    return [raw[i], raw[i + 1], raw[i + 2]];
  };

  const box = (test) => {
    let x0 = Infinity, y0 = Infinity, x1 = -1, y1 = -1;
    for (let y = 0; y < band; y++) {
      for (let x = 0; x < srcW; x++) {
        if (!test(at(x, y))) continue;
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
    return x1 < 0 ? null : { x0, y0, x1, y1 };
  };

  const dot = box(([r, g, b]) => r > 140 && g < 95 && b < 95);
  if (!dot) return null;

  // The island: pure black, scanned only across the dot's own rows.
  let px0 = Infinity, px1 = -1, py0 = Infinity, py1 = -1;
  const isBlack = ([r, g, b]) => r < 24 && g < 24 && b < 24;
  for (let y = 0; y < band; y++) {
    for (let x = 0; x < srcW; x++) {
      if (!isBlack(at(x, y))) continue;
      if (x < dot.x0 - 200 || x > dot.x1 + 500) continue;
      if (x < px0) px0 = x;
      if (x > px1) px1 = x;
      if (y < py0) py0 = y;
      if (y > py1) py1 = y;
    }
  }
  if (px1 < 0) return null;

  const m = 10;
  let x0 = dot.x0 - m, x1 = dot.x1 + m;
  const y0 = Math.max(py0 + 2, dot.y0 - m);
  const y1 = Math.min(py1 - 2, dot.y1 + m);

  // Stadium: at vertical offset dy from centre the cap eats
  // r - sqrt(r² - dy²) of the width. Inset by the worst case.
  const cy = (py0 + py1) / 2;
  const r = (py1 - py0) / 2;
  const dy = Math.max(Math.abs(y0 - cy), Math.abs(y1 - cy));
  const inset = r - Math.sqrt(Math.max(0, r * r - dy * dy));

  x0 = Math.max(x0, Math.ceil(px0 + inset));
  x1 = Math.min(x1, Math.floor(px1 - inset));
  if (x1 <= x0 || y1 <= y0) return null;

  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}

const filters = [];
if (cuts.length) {
  const between = cuts.map(([a, b]) => `between(t,${a},${b})`).join("+");
  filters.push(`select='${between}'`, "setpts=N/FRAME_RATE/TB");
}
filters.push("format=rgb24");

if (!has("keep-dot")) {
  const dot = findDotMask();
  if (dot) {
    filters.push(`drawbox=x=${dot.x}:y=${dot.y}:w=${dot.w}:h=${dot.h}:color=0x000000@1:t=fill`);
    console.log(`  masked recording indicator at ${dot.x},${dot.y} ${dot.w}x${dot.h}`);
  } else {
    console.log("  no recording indicator found");
  }
}

// --mask x,y,w,h[,rrggbb] — repeatable. Covers dev-build chrome a production
// recording wouldn't have, and status-bar glyphs the capture caught.
for (const spec of args.filter((a, i) => args[i - 1] === "--mask")) {
  const [x, y, w, h, color] = spec.split(",");
  filters.push(
    `drawbox=x=${x}:y=${y}:w=${w}:h=${h}:color=0x${color || "FFFFFF"}@1:t=fill`
  );
}

filters.push(
  `scale=${width}:-2:flags=lanczos:in_range=${fullRange ? "full" : "limited"}:out_range=limited`,
  "format=yuv420p"
);

run(FFMPEG, [
  "-v", "error", ...trim, "-i", input, "-an",
  "-vf", filters.join(","),
  "-c:v", "libx264", "-profile:v", "high", "-crf", String(crf),
  "-preset", "slow", "-g", "60", "-pix_fmt", "yuv420p",
  "-color_range", "tv", "-colorspace", "bt709",
  "-color_primaries", "bt709", "-color_trc", "bt709",
  "-movflags", "+faststart", "-y", mp4,
]);

run(FFMPEG, [
  "-v", "error", "-ss", String(flag("poster", "0")), "-i", mp4,
  "-frames:v", "1", "-c:v", "libwebp", "-quality", "82", "-y", webp,
]);

const kb = (f) => Math.round(statSync(f).size / 1024);
console.log(`  ${mp4}  ${kb(mp4)} KB`);
console.log(`  ${webp}  ${kb(webp)} KB`);

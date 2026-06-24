// Record an interactive figure as a looping GIF — the moving sibling of
// shoot.mjs's still screenshots. Same headless dev-server page, same capture
// region (so the GIF frames its subject exactly like the screenshot, controls
// included), but instead of one frame it captures the whole animation and
// stitches the sequence into a GIF with ffmpeg.
//
// Two figure shapes, two capture strategies — both deterministic, because a
// headless screenshot takes far longer than an animation frame, so capturing
// real-time playback would sample unevenly and tear:
//   • scrub — morph players (Mol*) expose a frame slider; we drive it one frame
//     at a time and wait for the engine to settle between captures.
//   • tween — toggle figures (the 2D T↔R switch, the 2,3-BPG doorstop) animate a
//     rAF + performance.now tween on a button click; we install a *virtual
//     clock* (queue rAF, freeze performance.now), click the toggle, then advance
//     the clock in even steps and snapshot each — no per-figure pose maths, just
//     "advance time, let React render, capture." Captured as a T→R→T round trip
//     so the loop is seamless.

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import {
  launchChrome,
  Page,
  discoverFigures,
  prepareFigure,
  setFigureFrame,
  padAndResize,
} from "./capture.mjs";

const FFMPEG = process.env.FFMPEG_BIN || "ffmpeg";

// Resolve a `--figure` selector against the discovered figures. Accepts a
// numeric document-order index, a substring matched case-insensitively against
// the figcaption (both work pre-mount — captions render even while a lazy 3D
// figure is still a placeholder), or "first-player" (default).
//
// "first-player" is the only mode that must mount: morph players are lazy, so a
// figure that shows no canvas/slider at load may become a player once scrolled
// near. We scan in document order, scrolling each candidate into view until one
// exposes both a canvas and a slider. Pass an explicit index/caption to skip the
// scan when an essay has several lazy 3D figures before the target.
async function resolveFigure(page, found, selector) {
  if (/^\d+$/.test(String(selector))) {
    const m = found[Number(selector)];
    if (!m) throw new Error(`no figure at index ${selector} (page has ${found.length})`);
    return m;
  }
  if (selector && selector !== "first-player") {
    const needle = String(selector).toLowerCase();
    const m = found.find((f) => (f.caption || "").toLowerCase().includes(needle));
    if (!m) throw new Error(`no figure caption matching "${selector}"`);
    return m;
  }
  const already = found.find((f) => f.hasCanvas && f.hasRange);
  if (already) return already;
  for (const f of found) {
    const isPlayer = await page.eval(`(async () => {
      const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
      const fig = document.querySelectorAll("figure")[${f.index}];
      if (!fig) return false;
      const el = fig.querySelector(":scope > div") || fig;
      el.scrollIntoView({ block: "center" });
      for (let i = 0; i < 16; i++) {
        if (el.querySelector("canvas") && el.querySelector('input[type="range"]')) return true;
        await sleep(250);
      }
      return false;
    })()`);
    if (isPlayer) return { ...f, hasCanvas: true, hasRange: true };
  }
  throw new Error("no morph player (canvas + slider) found on the page");
}

// Evenly pick `count` frame indices spanning 0…max (inclusive at both ends).
// Omitting `count` (or asking for >= the baked frames) keeps every frame.
function sampleFrames(max, count) {
  if (!count || count >= max + 1) return Array.from({ length: max + 1 }, (_, i) => i);
  return Array.from({ length: count }, (_, i) => Math.round((i * max) / (count - 1)));
}

// Stitch a sequence of equal-size PNG frame files into a looping GIF. Two passes
// via ffmpeg: palettegen builds an optimal 256-colour palette for the clip, then
// paletteuse renders against it with error-diffusion dither — far cleaner on a
// WebGL render than a naive global palette.
function encodeGif({ pattern, fps, outFile, log }) {
  const args = [
    "-y",
    "-framerate", String(fps),
    "-i", pattern,
    "-vf", "split[s0][s1];[s0]palettegen=stats_mode=full[p];[s1][p]paletteuse=dither=sierra2_4a",
    "-loop", "0",
    outFile,
  ];
  return new Promise((resolve, reject) => {
    const proc = spawn(FFMPEG, args, { stdio: ["ignore", "ignore", "pipe"] });
    let err = "";
    proc.stderr.on("data", (d) => (err += d));
    proc.on("error", (e) =>
      reject(
        e.code === "ENOENT"
          ? new Error(`ffmpeg not found (set FFMPEG_BIN or \`brew install ffmpeg\`).`)
          : e
      )
    );
    proc.on("close", (code) =>
      code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code}:\n${err.slice(-800)}`))
    );
  });
}

// Build a frame timeline by scrubbing a morph player's slider 0…max. The play
// button's glyph is forced per frame so the loop reads like a real recording:
// "play" on the opening hold, "pause" through the morph, "replay" on the close.
async function collectScrubFrames(
  page,
  index,
  rect,
  { frames, fps, startHoldMs, endHoldMs, pad, maxWidth, settle, playIcon, log }
) {
  // Don't capture frame 0 until the player is truly ready (slider enabled = Mol*
  // booted, the "Loading 3D…" overlay gone), or the opening hold freezes on the
  // loading state instead of the molecule.
  const ready = await page.eval(`(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const el = document.querySelectorAll("figure")[${index}].querySelector(":scope > div");
    const t0 = Date.now();
    while (Date.now() - t0 < 30000) {
      const sld = el.querySelector('input[type="range"]');
      if (sld && !sld.disabled) { await sleep(700); return true; }
      await sleep(250);
    }
    return false;
  })()`);
  if (!ready) log(`  ⚠ player still loading after 30s — frame 0 may be incomplete`);

  const max = Number(
    await page.eval(
      `String(document.querySelectorAll("figure")[${index}].querySelector('input[type=range]').max)`
    )
  );
  const seq = sampleFrames(max, frames);
  log(`  scrub player — ${seq.length} frames (slider 0…${max}) at ${maxWidth}px…`);

  const buffers = [];
  for (let i = 0; i < seq.length; i++) {
    const icon = !playIcon ? null : i === 0 ? "play" : i === seq.length - 1 ? "restart" : "pause";
    await setFigureFrame(page, index, seq[i], { settle, icon });
    buffers.push(await padAndResize(await page.captureClip(rect), { pad, maxWidth }));
    if ((i + 1) % 5 === 0 || i === seq.length - 1) log(`    …${i + 1}/${seq.length}`);
  }

  const holdStart = Math.max(0, Math.round((startHoldMs / 1000) * fps));
  const holdEnd = Math.max(0, Math.round((endHoldMs / 1000) * fps));
  const timeline = [
    ...Array(holdStart).fill(buffers[0]),
    ...buffers,
    ...Array(holdEnd).fill(buffers[buffers.length - 1]),
  ];
  return { timeline, frameCount: buffers.length };
}

// Build a frame timeline for a toggle figure by driving its rAF tween with a
// virtual clock. Captures a T→R→T round trip: hold T, play to R, hold R, play
// back to T — so looping the GIF (T at the end → T at the start) is seamless.
async function collectTweenFrames(
  page,
  index,
  rect,
  { fps, startHoldMs, midHoldMs, pad, maxWidth, settle, log }
) {
  const dt = Math.max(1, Math.round(1000 / fps)); // virtual ms advanced per frame
  const capture = async () => padAndResize(await page.captureClip(rect), { pad, maxWidth });

  const btnCount = await page.eval(
    `document.querySelectorAll("figure")[${index}].querySelectorAll('button').length`
  );
  if (btnCount < 2) {
    throw new Error(
      `figure ${index} has no slider and < 2 toggle buttons — nothing to animate`
    );
  }
  log(`  toggle figure — driving the tween with a virtual clock at ${maxWidth}px…`);

  // Queue every rAF callback instead of running it, and freeze performance.now to
  // a virtual time we control — so the tween advances only when we flush.
  await page.eval(`(() => {
    if (window.__vclock) return;
    window.__vclock = true; window.__vt = 0; window.__rafMap = new Map(); let id = 1;
    window.__realRAF = window.requestAnimationFrame.bind(window);
    window.__realCAF = window.cancelAnimationFrame.bind(window);
    window.__realNow = performance.now.bind(performance);
    window.requestAnimationFrame = (cb) => { const i = id++; window.__rafMap.set(i, cb); return i; };
    window.cancelAnimationFrame = (i) => { window.__rafMap && window.__rafMap.delete(i); };
    performance.now = () => window.__vt;
  })()`);

  // Click a toggle button, then advance the virtual clock in even steps —
  // flushing the queued rAF tick each time — until the tween stops rescheduling
  // (its last frame reached). Capturing after each step gives evenly-spaced poses.
  const playToggle = async (btnIndex) => {
    const out = [];
    await page.eval(`(async () => {
      const b = document.querySelectorAll("figure")[${index}].querySelectorAll('button');
      if (b[${btnIndex}]) b[${btnIndex}].click();
      await new Promise((r) => setTimeout(r, 90));
    })()`);
    for (let step = 0; step < 400; step++) {
      const pending = await page.eval(`(async () => {
        window.__vt += ${dt};
        const cbs = [...window.__rafMap.values()];
        window.__rafMap.clear();
        cbs.forEach((cb) => { try { cb(window.__vt); } catch (e) {} });
        await new Promise((r) => setTimeout(r, ${settle}));
        return window.__rafMap.size;
      })()`);
      out.push(await capture());
      if (pending === 0) break; // tween finished — no further frame scheduled
    }
    return out;
  };

  const open = await capture(); // starting (left/T) pose
  const fwd = await playToggle(1); // → right (R)
  const rev = await playToggle(0); // → left (T)

  // Restore the real clock so the page behaves normally afterwards.
  await page.eval(`(() => {
    if (!window.__vclock) return;
    window.requestAnimationFrame = window.__realRAF;
    window.cancelAnimationFrame = window.__realCAF;
    performance.now = window.__realNow;
    delete window.__vclock; delete window.__rafMap; delete window.__vt;
  })()`);

  const holdStart = Math.max(0, Math.round((startHoldMs / 1000) * fps));
  const holdMid = Math.max(0, Math.round((midHoldMs / 1000) * fps));
  const rPose = fwd.length ? fwd[fwd.length - 1] : open;
  const timeline = [
    ...Array(holdStart).fill(open),
    ...fwd,
    ...Array(holdMid).fill(rPose),
    ...rev,
  ];
  log(`  ${fwd.length} + ${rev.length} transition frames captured`);
  return { timeline, frameCount: fwd.length + rev.length };
}

// Turn each checkpoint token into a slider value. A bare number is used as-is; a
// label (e.g. "lungs") is matched against the figure's preset buttons — we click
// the match and read where the slider lands, so the journey is described in the
// figure's own vocabulary instead of magic numbers.
async function resolveCheckpoints(page, index, tokens) {
  const out = [];
  for (const tok of tokens) {
    const t = String(tok).trim();
    if (/^-?\d+(\.\d+)?$/.test(t)) { out.push(Number(t)); continue; }
    const v = await page.eval(`(async () => {
      const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
      const fig = document.querySelectorAll("figure")[${index}];
      const el = fig && (fig.querySelector(":scope > div") || fig);
      if (!el) return null;
      const needle = ${JSON.stringify(t.toLowerCase())};
      const btn = [...el.querySelectorAll('button')].find((b) => (b.textContent || "").toLowerCase().includes(needle));
      if (!btn) return null;
      btn.click();
      await sleep(60);
      const s = el.querySelector('input[type="range"]');
      return s ? Number(s.value) : null;
    })()`);
    if (v == null) throw new Error(`checkpoint "${t}" not found (no preset button matching it)`);
    out.push(v);
  }
  return out;
}

// Build a frame timeline that walks a continuous slider through a sequence of
// checkpoints — sweeping smoothly between them and holding at each — then
// (loopBack) sweeps back to the first so the GIF loops seamlessly. For the
// saturation chart: lungs → resting tissue → working muscle, the O₂ unloading a
// red cell does as it travels from the lungs out to the tissues.
async function collectSweepFrames(
  page,
  index,
  rect,
  { checkpoints, fps, checkpointHoldMs, sweepRate, pad, maxWidth, settle, loopBack, log }
) {
  const cps = await resolveCheckpoints(page, index, checkpoints);
  const meta =
    (await page.eval(`(() => {
      const el = document.querySelectorAll("figure")[${index}].querySelector(":scope > div");
      const s = el && el.querySelector('input[type="range"]');
      return s ? { min: Number(s.min) || 0, max: Number(s.max) || 100, step: Number(s.step) || 1 } : null;
    })()`)) || { min: 0, max: 100, step: 1 };
  log(`  sweep — ${cps.join(" → ")} (slider ${meta.min}…${meta.max}) at ${maxWidth}px…`);

  const capture = async () => padAndResize(await page.captureClip(rect), { pad, maxWidth });
  const snap = (v) =>
    Math.max(meta.min, Math.min(meta.max, Math.round(v / meta.step) * meta.step));
  // Frames between two checkpoints, at a constant slider speed (sweepRate units
  // per second). Excludes the start (already captured), includes the endpoint.
  const unitsPerFrame = Math.max(meta.step, sweepRate / fps);
  const segment = (a, b) => {
    const n = Math.max(1, Math.round(Math.abs(b - a) / unitsPerFrame));
    return Array.from({ length: n }, (_, k) => snap(a + ((b - a) * (k + 1)) / n));
  };
  const hold = Math.max(1, Math.round((checkpointHoldMs / 1000) * fps));

  const buffers = [];
  await setFigureFrame(page, index, snap(cps[0]), { settle });
  const first = await capture();
  for (let i = 0; i < hold; i++) buffers.push(first); // hold the opening checkpoint

  for (let i = 0; i < cps.length - 1; i++) {
    for (const v of segment(cps[i], cps[i + 1])) {
      await setFigureFrame(page, index, v, { settle });
      buffers.push(await capture());
    }
    const landed = buffers[buffers.length - 1];
    for (let h = 1; h < hold; h++) buffers.push(landed); // pause at this checkpoint
    log(`    …checkpoint ${i + 2}/${cps.length} (slider ${cps[i + 1]})`);
  }

  if (loopBack && cps.length > 1) {
    const back = segment(cps[cps.length - 1], cps[0]);
    back.pop(); // the final frame == the opening checkpoint; the loop supplies it
    for (const v of back) {
      await setFigureFrame(page, index, v, { settle });
      buffers.push(await capture());
    }
  }
  return { timeline: buffers, frameCount: buffers.length };
}

export async function recordFigure({
  route,
  outFile,
  baseUrl = "http://localhost:3000",
  port = 9223,
  figure = "first-player",
  frames = null, // sample N frames across the morph; null = every baked frame
  fps = 20,
  startHoldMs = 600, // freeze on the opening pose (T / frame 0)
  endHoldMs = 900, // freeze on the closing pose (R / last frame)
  pad = 28,
  maxWidth = 800,
  settle = null, // ms to settle after each step (per-mode default if unset)
  playIcon = true, // force the "pause" glyph mid-morph so it reads as playing
  sweep = null, // checkpoint list (values/labels) → sweep mode on a slider chart
  checkpointHoldMs = 1000, // pause at each sweep checkpoint
  sweepRate = 45, // slider units per second between checkpoints
  loopBack = true, // sweep back to the first checkpoint to close the loop
  keepFrames = false,
  log = () => {},
}) {
  const url = baseUrl.replace(/\/$/, "") + route;
  const res = await fetch(url).catch(() => null);
  if (!res || !res.ok) {
    throw new Error(`Dev server not reachable at ${url}. Start it first (e.g. \`npm run dev\`).`);
  }
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  const frameDir = keepFrames
    ? path.join(path.dirname(outFile), path.basename(outFile, path.extname(outFile)) + ".frames")
    : fs.mkdtempSync(path.join(os.tmpdir(), "newt-gif-"));
  fs.mkdirSync(frameDir, { recursive: true });

  log(`launching headless Chrome…`);
  const { proc, port: p } = await launchChrome({ port });
  let page;
  try {
    page = await Page.open(p, url);
    const found = await discoverFigures(page);
    const target = await resolveFigure(page, found, figure);
    log(`figure #${target.index}${target.caption ? ` — "${target.caption}"` : ""}`);

    // prepareFigure scrolls the (possibly lazy) figure into view and waits for it
    // to mount + render. A generous wait covers the dev server compiling a lazy
    // player chunk on first load (longer than the still-capture default).
    const rect = await prepareFigure(page, target.index, { waitMs: 30000 });

    // Three capture modes, each building a frame timeline:
    //  • sweep — explicit checkpoints on a continuous slider (e.g. a chart);
    //  • scrub — a frame slider (Mol* morph player), driven 0…max;
    //  • tween — a toggle figure, driven via the virtual clock.
    const sweepMode = Array.isArray(sweep) && sweep.length > 0;
    if (sweepMode && !rect.hasRange) {
      throw new Error(`figure ${target.index} has no slider — --sweep needs a slider chart`);
    }
    const { timeline, frameCount } = sweepMode
      ? await collectSweepFrames(page, target.index, rect, {
          checkpoints: sweep, fps, checkpointHoldMs, sweepRate, pad, maxWidth,
          settle: settle ?? 40, loopBack, log,
        })
      : rect.hasRange
      ? await collectScrubFrames(page, target.index, rect, {
          frames, fps, startHoldMs, endHoldMs, pad, maxWidth,
          settle: settle ?? 500, playIcon, log,
        })
      : await collectTweenFrames(page, target.index, rect, {
          fps, startHoldMs, midHoldMs: endHoldMs, pad, maxWidth,
          settle: settle ?? 80, log,
        });

    timeline.forEach((buf, i) =>
      fs.writeFileSync(path.join(frameDir, `f${String(i).padStart(4, "0")}.png`), buf)
    );

    log(`encoding GIF (${timeline.length} frames @ ${fps}fps)…`);
    await encodeGif({
      pattern: path.join(frameDir, "f%04d.png"),
      fps,
      outFile,
      log,
    });
    const bytes = fs.statSync(outFile).size;
    log(`  ✓ ${path.basename(outFile)}  ${(bytes / 1024).toFixed(0)} KB`);
    return { outFile, frames: frameCount, bytes, figureIndex: target.index };
  } finally {
    page?.close();
    proc.kill();
    if (!keepFrames) fs.rmSync(frameDir, { recursive: true, force: true });
  }
}

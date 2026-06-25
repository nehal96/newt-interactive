// Reusable headless-Chrome capture core for the article-export toolkit.
//
// The hard-won bit: headless Chrome drops GPU-composited canvas layers (WebGL,
// accelerated 2D) from normal screenshots. Launching with software GL
// (SwiftShader) + software compositing, and capturing with
// `captureBeyondViewport`, makes the WebGL figures (Mol*, react-three-fiber)
// composite into the screenshot like any other DOM. So a plain element
// screenshot works for 3D and 2D figures alike.
//
// Everything here is generic — no per-essay or per-figure knowledge. The newt
// vocabulary lives in rules.mjs; the orchestration in shoot.mjs.

import { spawn } from "node:child_process";

const CHROME =
  process.env.CHROME_BIN ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

// Layout viewport + pixel density for every capture. dsf 2 → retina output.
export const VIEW = { width: 1280, height: 2400, dsf: 2 };

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// --- Chrome process -------------------------------------------------------

export async function launchChrome({ port = 9222, userDataDir } = {}) {
  const dir = userDataDir || `/tmp/article-export-chrome-${port}`;
  const proc = spawn(
    CHROME,
    [
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${dir}`,
      "--no-first-run",
      "--no-default-browser-check",
      "--disable-extensions",
      "--headless=new",
      "--hide-scrollbars",
      // WebGL via SwiftShader + software compositing → screenshots capture it.
      "--use-gl=angle",
      "--use-angle=swiftshader",
      "--enable-unsafe-swiftshader",
      "--disable-gpu-compositing",
      "about:blank",
    ],
    { stdio: "ignore", detached: false }
  );
  // Wait for the DevTools endpoint to come up.
  const base = `http://127.0.0.1:${port}`;
  for (let i = 0; i < 50; i++) {
    try {
      const r = await fetch(`${base}/json/version`);
      if (r.ok) return { proc, port, base };
    } catch {}
    await sleep(200);
  }
  proc.kill();
  throw new Error("Chrome DevTools endpoint did not come up");
}

// --- CDP client (direct page-target websocket; no session routing) --------

class CDP {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    this.handlers = [];
  }
  static async connect(wsUrl) {
    const ws = new WebSocket(wsUrl);
    await new Promise((res, rej) => {
      ws.onopen = res;
      ws.onerror = () => rej(new Error("CDP websocket error"));
    });
    const cdp = new CDP(ws);
    ws.onmessage = (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && cdp.pending.has(msg.id)) {
        const { resolve, reject } = cdp.pending.get(msg.id);
        cdp.pending.delete(msg.id);
        msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
      } else if (msg.method) {
        cdp.handlers.forEach((h) => h(msg));
      }
    };
    return cdp;
  }
  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
  on(fn) {
    this.handlers.push(fn);
  }
  close() {
    try { this.ws.close(); } catch {}
  }
}

// --- Page --------------------------------------------------------------------

export class Page {
  constructor(cdp) {
    this.cdp = cdp;
  }

  static async open(port, url) {
    const base = `http://127.0.0.1:${port}`;
    const res = await fetch(`${base}/json/new?${url}`, { method: "PUT" });
    const target = await res.json();
    const cdp = await CDP.connect(target.webSocketDebuggerUrl);
    await cdp.send("Page.enable");
    await cdp.send("Runtime.enable");
    await cdp.send("Emulation.setDeviceMetricsOverride", {
      width: VIEW.width,
      height: VIEW.height,
      deviceScaleFactor: VIEW.dsf,
      mobile: false,
    });
    const page = new Page(cdp);
    await page.waitForLoad(url);
    return page;
  }

  async waitForLoad(url) {
    const loaded = new Promise((res) =>
      this.cdp.on((m) => m.method === "Page.loadEventFired" && res())
    );
    await this.cdp.send("Page.navigate", { url });
    await Promise.race([loaded, sleep(10000)]);
    await sleep(1200);
  }

  async eval(expr) {
    const r = await this.cdp.send("Runtime.evaluate", {
      expression: expr,
      awaitPromise: true,
      returnByValue: true,
    });
    if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails));
    return r.result.value;
  }

  async captureClip({ x, y, width, height }) {
    const shot = await this.cdp.send("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: true,
      clip: { x, y, width, height, scale: 1 },
    });
    return Buffer.from(shot.data, "base64");
  }

  close() {
    this.cdp.close();
  }
}

// --- Figure discovery (generic: every <figure> in document order) ---------

// A small in-page helper, shared by discovery and capture, that decides when a
// figure has finished rendering: any WebGL canvas has drawn content, and any
// player control (a disabled-until-ready slider) has become enabled.
export const READINESS_HELPERS = `
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const hasContent = (c) => {
    try {
      const t = document.createElement("canvas");
      t.width = Math.min(c.width, 240); t.height = Math.min(c.height, 140);
      const g = t.getContext("2d");
      g.drawImage(c, 0, 0, t.width, t.height);
      const d = g.getImageData(0, 0, t.width, t.height).data;
      let nw = 0;
      for (let i = 0; i < d.length; i += 4)
        if (d[i] < 248 || d[i+1] < 248 || d[i+2] < 248) nw++;
      return nw > 40;
    } catch (e) { return false; }
  };
`;

export async function discoverFigures(page) {
  return page.eval(`(() => {
    return [...document.querySelectorAll("figure")].map((f, i) => {
      const cap = f.querySelector("figcaption");
      return {
        index: i,
        caption: cap ? cap.textContent.trim() : null,
        hasCanvas: !!f.querySelector("canvas"),
        hasRange: !!f.querySelector('input[type="range"]'),
        buttons: f.querySelectorAll("button").length,
        hasSvg: !!f.querySelector("svg"),
      };
    });
  })()`);
}

// Bring a figure to a capturable resting state and return its capture region.
// Scrolls it into view, waits until it's ready (canvas drawn, slider enabled),
// nudges any WebGL canvas to ~2x for retina, hides Mol* toasts, then returns the
// figure's first child div rect (the visual content, excluding any sibling
// <figcaption>) in page coordinates plus the detected canvas/range flags. The
// rect is stable across frame changes, so a recorder can prepare once and reuse
// it for every frame. No frame is set here — that's setFigureFrame's job.
export async function prepareFigure(page, index, { waitMs = 12000 } = {}) {
  const info = await page.eval(`(async () => {
    ${READINESS_HELPERS}
    const figs = [...document.querySelectorAll("figure")];
    const fig = figs[${index}];
    if (!fig) return JSON.stringify({ error: "no-figure" });
    const el = fig.querySelector(":scope > div") || fig;
    el.scrollIntoView({ block: "center" });
    await sleep(400);
    // Wait until ready: canvas drawn (if any) and slider enabled (if any).
    const t0 = Date.now();
    while (Date.now() - t0 < ${waitMs}) {
      const canvas = el.querySelector("canvas");
      const sld = el.querySelector('input[type="range"]');
      const ready = !sld || !sld.disabled;
      const drawn = !canvas || hasContent(canvas);
      if (ready && drawn) break;
      await sleep(300);
    }
    // Retina: nudge the WebGL canvas to ~2x its CSS size (Mol* boots at 1x).
    const cvs = el.querySelector("canvas");
    if (cvs) {
      const cssW = cvs.clientWidth;
      let n = 0;
      while (cvs.width < cssW * 2 * 0.95 && n < 25) {
        window.dispatchEvent(new Event("resize"));
        await sleep(250); n++;
      }
      await sleep(900);
    }
    el.querySelectorAll('[class*="msp-toast"]').forEach((e) => { e.style.display = "none"; });
    await sleep(500);
    const r = el.getBoundingClientRect();
    return JSON.stringify({
      x: r.x + window.scrollX, y: r.y + window.scrollY,
      width: r.width, height: r.height,
      // Detected now (post-boot) so the kind is accurate for lazy 3D figures.
      hasCanvas: !!el.querySelector("canvas"),
      hasRange: !!el.querySelector('input[type="range"]'),
    });
  })()`);
  const rect = JSON.parse(info);
  if (rect.error) throw new Error(`prepareFigure[${index}]: ${rect.error}`);
  return rect;
}

const PLAY_ICON_PATHS = {
  play: "M8 5v14l11-7z",
  pause: "M6 5h4v14H6zM14 5h4v14h-4z",
  restart: "M12 5V2L7 7l5 5V8a6 6 0 1 1-6 6H4a8 8 0 1 0 8-9z",
};

// Drive a morph player's slider to `frame` (0-based) and let Mol* settle.
// React owns the slider (onChange fires on "input"), so we poke the native value
// setter and dispatch input/change exactly as a user drag would. `settle` is how
// long to wait for the engine to recommit + repaint before the caller captures.
// `icon` optionally overwrites the play button's glyph for this one capture
// (e.g. force "pause" mid-playthrough so a recording looks like a real play) —
// applied after the settle, since the scrub's React re-render resets it first.
export async function setFigureFrame(
  page,
  index,
  frame,
  { settle = 500, icon = null } = {}
) {
  await page.eval(`(async () => {
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    const figs = [...document.querySelectorAll("figure")];
    const el = figs[${index}] && figs[${index}].querySelector(":scope > div");
    if (!el) return;
    const sld = el.querySelector('input[type="range"]');
    if (sld && !sld.disabled) {
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype, "value").set;
      setter.call(sld, String(${Number(frame)}));
      sld.dispatchEvent(new Event("input", { bubbles: true }));
      sld.dispatchEvent(new Event("change", { bubbles: true }));
    }
    await sleep(${Number(settle)});
    const icon = ${icon ? JSON.stringify(PLAY_ICON_PATHS[icon] || null) : "null"};
    if (icon) {
      const path = el.querySelector('button svg path');
      if (path) { path.setAttribute('d', icon); await sleep(30); }
    }
  })()`);
}

// Shared post-processing for a raw clip buffer: a white margin (so figures
// breathe against newsletter prose) then a width cap. Applied identically to
// stills and to every GIF frame, so a recording frames its subject exactly like
// the screenshot would.
export async function padAndResize(buf, { pad = 28, maxWidth = 1400 } = {}) {
  const sharp = (await import("sharp")).default;
  const p = pad * VIEW.dsf; // capture is at dsf, so pad in device px
  buf = await sharp(buf)
    .extend({ top: p, bottom: p, left: p, right: p, background: "#ffffff" })
    .png()
    .toBuffer();
  const w = buf.readUInt32BE(16);
  if (maxWidth && w > maxWidth) {
    buf = await sharp(buf).resize({ width: maxWidth }).png().toBuffer();
  }
  return buf;
}

// Capture one figure (by document-order index) as a padded, width-capped PNG.
// Works for 3D (canvas + gizmo), morph players (canvas + controls), and 2D
// (SVG/charts). `frame` (a number) drives a morph slider; omit to keep the
// figure's default interactive state. The capture region is the figure's first
// child div — the visual content, excluding any sibling <figcaption>.
export async function captureFigure(
  page,
  index,
  { pad = 28, maxWidth = 1400, frame = null, waitMs = 12000 } = {}
) {
  const rect = await prepareFigure(page, index, { waitMs });
  // Optional: drive a morph slider to a frame; otherwise keep default state.
  if (frame !== null && rect.hasRange) {
    await setFigureFrame(page, index, frame, { settle: 900 });
  }
  const buf = await padAndResize(await page.captureClip(rect), { pad, maxWidth });
  const kind = rect.hasCanvas ? (rect.hasRange ? "player" : "3d") : "2d";
  return { buf, kind };
}

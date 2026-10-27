// Kendrew's 1957 contour sheets of myoglobin, laid out and stacked.
import { useEffect, useRef, useState } from "react";
import { Button } from "@ui/controls";
import { CheckRow } from "./controls";

const LABELS = ["a", "b", "c", "d", "e", "f", "g", "h"];
const HEME = new Set(["e", "f", "g"]);
const HEIGHTS = ["+4/16", "+3/16", "+2/16", "+1/16", "0", "−1/16", "−2/16", "−3/16"];

const NARROW = 560;
const TILT = -54;
const YAW = -24;
const MAX_PITCH = 78;

const SPACING_A = 1.93;
const SHEET_WIDTH_A = 74.06;
const SHEET_HEIGHT_A = 33.36;
const ASPECT = SHEET_WIDTH_A / SHEET_HEIGHT_A;
const EXAGGERATION = 2.6;
const SPACING = (SPACING_A / SHEET_WIDTH_A) * EXAGGERATION;

// Must match the outline path in the sheet SVGs, or the slab edges float free
// of the drawing they belong to.
const CELL = [
  [0, 1],
  [64.5 / SHEET_WIDTH_A, 1],
  [1, 0],
  [9.56 / SHEET_WIDTH_A, 0],
];

const CLIP = `polygon(${CELL.map(([x, y]) => `${x * 100}% ${y * 100}%`).join(
  ", "
)})`;

const PLATE = SPACING * 0.34;
const PLATE_H = PLATE * ASPECT * 100;

const LIGHT = [-0.55, -0.84];

const EDGES = CELL.map(([x, y], i) => {
  const [nx, ny] = CELL[(i + 1) % CELL.length];
  const dx = nx - x;
  const dy = (ny - y) / ASPECT;
  const angle = Math.atan2(dy, dx);
  const lit = Math.max(
    0,
    -Math.sin(angle) * LIGHT[0] + Math.cos(angle) * LIGHT[1]
  );
  return {
    left: `${x * 100}%`,
    top: `${y * 100}%`,
    width: `${Math.hypot(dx, dy) * 100}%`,
    rotate: (angle * 180) / Math.PI,
    face:
      `linear-gradient(180deg,` +
      ` rgba(255,255,255,${(0.5 + 0.35 * lit).toFixed(3)}) 0%,` +
      ` rgba(214,212,226,${(0.35 + 0.25 * lit).toFixed(3)}) 14%,` +
      ` rgba(150,147,172,${(0.5 - 0.12 * lit).toFixed(3)}) 46%,` +
      ` rgba(118,115,142,${(0.62 - 0.14 * lit).toFixed(3)}) 86%,` +
      ` rgba(88,84,112,${(0.55 - 0.12 * lit).toFixed(3)}) 100%)`,
  };
});

const SHEEN =
  "linear-gradient(118deg," +
  " rgba(255,255,255,0.7) 0%," +
  " rgba(255,255,255,0) 15%," +
  " rgba(150,147,172,0.035) 50%," +
  " rgba(255,255,255,0) 86%," +
  " rgba(255,255,255,0.5) 100%)";

const FLY_MS = 800;
const STAGGER = 70;
const FOCUS_MS = 600;
const FOCUS_PAD = 12;

const WIDE = {
  sheetW: 23,
  zoom: 2.1,
  focusW: 92,
  cols: [-163, -54.3, 54.3, 163],
  rows: [-63.5, 63.5],
  stackedH: 0.5,
};
const PHONE = {
  sheetW: 46,
  zoom: 1.75,
  focusW: 100,
  cols: [-54.3, 54.3],
  rows: [-190.5, -63.5, 63.5, 190.5],
  stackedH: 0.8,
};

const GRID_GAP = 32;

// Height of the laid-out grid as a fraction of the figure's width.
function laidH({ sheetW, rows }: typeof WIDE) {
  const span = (rows[rows.length - 1] - rows[0]) / 100 + 1;
  return (span * sheetW) / 100 / ASPECT;
}

export default function SheetStack() {
  const [stacked, setStacked] = useState(false);
  const [focus, setFocus] = useState<number | null>(null);
  const [moving, setMoving] = useState<"stack" | "focus">("stack");
  const [heme, setHeme] = useState(false);
  const [pitch, setPitch] = useState(0);
  const [yaw, setYaw] = useState(0);
  const [width, setWidth] = useState(0);
  const scene = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const el = scene.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const toggle = () => {
    setPitch(0);
    setYaw(0);
    setFocus(null);
    setMoving("stack");
    setStacked((s) => !s);
  };

  const look = (i: number | null) => {
    setMoving("focus");
    setFocus(i);
  };

  const layout = width > 0 && width < NARROW ? PHONE : WIDE;
  const lift = ((width * layout.sheetW) / 100) * SPACING;

  const onDown = (e: React.PointerEvent) => {
    if (!stacked) return;
    drag.current = { x: e.clientX, y: e.clientY };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };

  const onMove = (e: React.PointerEvent) => {
    const from = drag.current;
    if (!from) return;
    drag.current = { x: e.clientX, y: e.clientY };
    setYaw((v) => v + (e.clientX - from.x) * 0.45);
    setPitch((v) =>
      Math.max(-MAX_PITCH, Math.min(MAX_PITCH, v - (e.clientY - from.y) * 0.45))
    );
  };

  const onUp = (e: React.PointerEvent) => {
    drag.current = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
  };

  const ease = "cubic-bezier(.2,.7,.2,1)";
  const ms = moving === "stack" ? FLY_MS : FOCUS_MS;
  const curve = moving === "stack" ? ease : "cubic-bezier(.65,0,.35,1)";
  const laidOut = width * laidH(layout) + 2 * GRID_GAP;
  const sheetPx = (width * layout.sheetW) / 100;
  const focusScale = width
    ? Math.min((width * layout.focusW) / 100, (laidOut - 2 * FOCUS_PAD) * ASPECT) / sheetPx
    : 1;
  const z = layout.zoom;

  return (
    // `clip`, not `hidden`: hidden would flatten the stack's 3D.
    <div className="w-full overflow-x-clip">
      <div
        ref={scene}
        className="[perspective:1600px]"
        style={{ touchAction: stacked ? "none" : "auto", cursor: stacked ? "grab" : "default" }}
        onClick={() => focus !== null && look(null)}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        <div
          className="relative [transform-style:preserve-3d]"
          style={{
            height: width ? (stacked ? width * layout.stackedH : laidOut) : undefined,
            aspectRatio: width ? undefined : `1 / ${laidH(WIDE)}`,
            transform: `rotateX(${pitch}deg) rotateY(${yaw}deg)`,
            transition: `height ${FLY_MS}ms ${ease}`,
          }}
        >
          {/* The zoom stays on; laid out, each sheet undoes it, so stacking is one motion per sheet. */}
          <div
            className="pointer-events-none absolute inset-0 [transform-style:preserve-3d]"
            style={{ transform: `scale(${z})` }}
          >
            <div
              className="absolute inset-0 [transform-style:preserve-3d]"
              style={{
                transform: stacked
                  ? `rotateX(${TILT}deg) rotateY(${YAW}deg)`
                  : "none",
                transition: `transform ${FLY_MS}ms ${ease}`,
              }}
            >
              {LABELS.map((label, i) => {
                const delay =
                  moving === "stack"
                    ? `${(stacked ? LABELS.length - 1 - i : i) * STAGGER}ms`
                    : "0ms";
                const focused = focus === i;
                const hidden = focus !== null && !focused;
                const fade = {
                  opacity: stacked ? 0.5 : hidden ? 0 : 1,
                  transition: `opacity ${ms}ms ${curve}`,
                  transitionDelay: delay,
                };
                return (
                  // Opacity here would flatten the preserve-3d and collapse the
                  // side faces — the children fade instead.
                  <div
                    key={label}
                    role={stacked ? undefined : "button"}
                    tabIndex={stacked || hidden ? -1 : 0}
                    aria-label={focused ? "Back to all eight slices" : `Look closer at slice ${label}`}
                    onClick={(e) => {
                      if (stacked) return;
                      e.stopPropagation();
                      look(focused ? null : i);
                    }}
                    onKeyDown={(e) => {
                      if (stacked) return;
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        look(focused ? null : i);
                      } else if (e.key === "Escape" && focus !== null) look(null);
                    }}
                    className={`absolute [transform-style:preserve-3d] ${
                      stacked || hidden ? "" : "pointer-events-auto"
                    }`}
                    style={{
                      left: `${50 - layout.sheetW / 2}%`,
                      top: `calc(50% - ${sheetPx / ASPECT / 2}px)`,
                      width: `${layout.sheetW}%`,
                      aspectRatio: `${SHEET_WIDTH_A} / ${SHEET_HEIGHT_A}`,
                      cursor: stacked ? undefined : focused ? "zoom-out" : "zoom-in",
                      transform: stacked
                        ? `translate(0%, 0%) translateZ(${(3.5 - i) * lift}px) scale(1)`
                        : focused
                          ? `translate(0%, 0%) translateZ(1px) scale(${focusScale / z})`
                          : `translate(${layout.cols[i % layout.cols.length] / z}%, ${
                              layout.rows[Math.floor(i / layout.cols.length)] / z
                            }%) translateZ(0px) scale(${1 / z})`,
                      transition: `transform ${ms}ms ${curve}`,
                      transitionDelay: delay,
                    }}
                  >
                    {EDGES.map((edge, e) => (
                      <div
                        key={e}
                        className="absolute"
                        style={{
                          left: edge.left,
                          top: edge.top,
                          width: edge.width,
                          height: `${PLATE_H}%`,
                          transformOrigin: "0 0",
                          transform: `rotateZ(${edge.rotate}deg) rotateX(-90deg)`,
                          backfaceVisibility: "hidden",
                          background: edge.face,
                          opacity: hidden ? 0 : 1,
                          transition: `opacity ${ms}ms ${curve}`,
                        }}
                      />
                    ))}
                    <div
                      className="absolute inset-0"
                      style={{ clipPath: CLIP, background: SHEEN, ...fade }}
                    />
                    <img
                      src={`/images/first-structures/kendrew-sheet-${label}-solids.svg`}
                      alt={`Fourier section at y = ${HEIGHTS[i]} b`}
                      draggable={false}
                      className="absolute inset-0 h-full w-full select-none"
                      style={fade}
                    />
                    {HEME.has(label) && (
                      <img
                        src={`/images/first-structures/kendrew-sheet-${label}-heme.svg`}
                        alt=""
                        draggable={false}
                        className="absolute inset-0 h-full w-full select-none"
                        style={{
                          opacity: heme && !hidden ? 1 : 0,
                          transition: `opacity 300ms ${ease}`,
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
        <Button variant="outline" onClick={toggle} className="text-sm">
          {stacked ? "Lay them out" : "Stack them"}
        </Button>
        <CheckRow label="Mark the heme" checked={heme} onChange={setHeme} />
        <span className="text-xs text-ink-500">
          {stacked
            ? "Drag to turn the stack"
            : focus !== null
              ? "Click it again to go back"
              : "Click a slice to look closer"}
        </span>
      </div>

    </div>
  );
}

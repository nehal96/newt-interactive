import { useEffect, useRef, useState } from "react";
import { Button } from "@ui/controls";
import { Caption } from "./controls";

const LABELS = ["a", "b", "c", "d", "e", "f", "g", "h"];
const HEIGHTS = ["+4/16", "+3/16", "+2/16", "+1/16", "0", "−1/16", "−2/16", "−3/16"];

const COLS = 4;
const SHEET_W = 23;
const ZOOM = 2.1;
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
const STAGGER = 40;
const ZOOM_MS = 600;
const SETTLE = FLY_MS + STAGGER * (LABELS.length - 1) + 40;

const COL_OFFSET = [-163, -54.3, 54.3, 163];
const ROW_OFFSET = [-63.5, 63.5];

export default function SheetStack() {
  const [stacked, setStacked] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [pitch, setPitch] = useState(0);
  const [yaw, setYaw] = useState(0);
  const [width, setWidth] = useState(0);
  const scene = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const el = scene.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  const toggle = () => {
    if (timer.current) clearTimeout(timer.current);
    setPitch(0);
    setYaw(0);
    if (stacked) {
      setZoomed(false);
      timer.current = setTimeout(() => setStacked(false), ZOOM_MS);
    } else {
      setStacked(true);
      timer.current = setTimeout(() => setZoomed(true), SETTLE);
    }
  };

  const lift = ((width * SHEET_W) / 100) * SPACING;

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

  return (
    <figure className="mx-auto my-8 w-full max-w-[40rem] lg:my-12 lg:max-w-[52rem]">
      <div
        ref={scene}
        className="[perspective:1600px]"
        style={{ touchAction: "none", cursor: stacked ? "grab" : "default" }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        <div
          className="relative aspect-[2/1] [transform-style:preserve-3d]"
          style={{ transform: `rotateX(${pitch}deg) rotateY(${yaw}deg)` }}
        >
          <div
            className="pointer-events-none absolute inset-0 [transform-style:preserve-3d]"
            style={{
              transform: `scale(${zoomed ? ZOOM : 1})`,
              transition: `transform ${ZOOM_MS}ms ${ease}`,
            }}
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
                const delay = `${(stacked ? i : LABELS.length - 1 - i) * STAGGER}ms`;
                const fade = {
                  opacity: stacked ? 0.5 : 1,
                  transition: `opacity ${FLY_MS}ms ${ease}`,
                  transitionDelay: delay,
                };
                return (
                  // Opacity here would flatten the preserve-3d and collapse the
                  // side faces — the children fade instead.
                  <div
                    key={label}
                    className="absolute left-1/2 top-1/2 [transform-style:preserve-3d]"
                    style={{
                      width: `${SHEET_W}%`,
                      aspectRatio: `${SHEET_WIDTH_A} / ${SHEET_HEIGHT_A}`,
                      transform: stacked
                        ? `translate(-50%, -50%) translateZ(${(3.5 - i) * lift}px)`
                        : `translate(${-50 + COL_OFFSET[i % COLS]}%, ${
                            -50 + ROW_OFFSET[Math.floor(i / COLS)]
                          }%)`,
                      transition: `transform ${FLY_MS}ms ${ease}`,
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
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <Button variant="outline" onClick={toggle} className="text-sm">
          {stacked ? "Lay them out" : "Stack them"}
        </Button>
        <span className="text-xs text-ink-500">
          {stacked ? "Drag to turn" : "Eight sections, y = +4/16 b to −3/16 b"}
        </span>
      </div>

      <Caption>
        The eight sections of the 6 Å synthesis that Kendrew&rsquo;s group
        computed, traced from figure 18 of Bodo, Dintzis, Kendrew &amp; Wyckoff,{" "}
        <cite>Proc. R. Soc. A</cite> <b>253</b>, 70 (1959). Each parallelogram is
        one unit cell — 64.5 Å along a, 34.7 Å along c, meeting at 74° — and only
        the contours above the cell&rsquo;s mean electron density are drawn.
        Eight is half the crystal: the other eight sheets of the physical model
        are these same drawings turned through 180°, which is what the screw axis
        does. The sheets are pulled apart here for legibility; true spacing is
        1.93 Å, about a twentieth of a sheet&rsquo;s height.
      </Caption>
    </figure>
  );
}

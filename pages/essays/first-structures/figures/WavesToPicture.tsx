// Each spot's wave laid across the unit cell and added up: right phases put the peaks on the atoms, others don't.
import { useId, useRef, useState, type PointerEvent } from "react";
import { useElementWidth } from "@hooks";
import { XR } from "./palette";
import { TAU, curvePath } from "./wave";

/** Fractional positions of three equal atoms along one unit cell. */
export const ATOMS = [0.24, 0.51, 0.74];
/** Higher orders fade, as they do for real atoms; keeps the four heights comparable. */
const BLUR = 0.035;

const WAVES = [1, 2, 3, 4].map((h) => {
  let re = 0;
  let im = 0;
  for (const x of ATOMS) {
    re += Math.cos(TAU * h * x);
    im += Math.sin(TAU * h * x);
  }
  const fade = Math.exp(-BLUR * h * h);
  return { h, amp: fade * Math.hypot(re, im), phase: Math.atan2(im, re) };
});

const MAX_AMP = Math.max(...WAVES.map((w) => w.amp));
/** Each wave's shift, in its own wavelengths, for the wrong picture. */
const OTHER = [0, 0.5, 0, 0.5];
const RIGHT = [0, 0, 0, 0];

const wrap = (v: number) => v - Math.floor(v + 0.5);

/** One wave at fraction `x` of the cell; `shift` in the wave's own wavelengths. */
function waveAt(i: number, x: number, shift: number) {
  const { h, amp, phase } = WAVES[i];
  return amp * Math.cos(TAU * (h * x - shift) - phase);
}
const sumAt = (x: number, shifts: number[]) =>
  WAVES.reduce((s, _, i) => s + waveAt(i, x, shifts[i]), 0);

type Layout = {
  rowH: number;
  scale: number;
  sumH: number;
  text: number;
  headerSize: number;
  narrow: boolean;
};

/** Vertical positions shared by the gutter and both columns; row 0 is the film's center. */
function rowsAt(y: number, { rowH, sumH }: Layout) {
  const centerY = y + 22 + rowH / 2;
  const waveY = (i: number) => centerY + (i + 1) * rowH;
  const sumY = waveY(WAVES.length - 1) + rowH / 2 + sumH / 2 + 6;
  return { centerY, waveY, sumY, atomsY: sumY + sumH / 2 + 10 };
}

function Column({
  x,
  y,
  w,
  shifts,
  header,
  layout,
  showCell,
  dragging,
  onDragStart,
}: {
  x: number;
  y: number;
  w: number;
  shifts: number[];
  header: string;
  layout: Layout;
  showCell?: boolean;
  dragging?: number | null;
  onDragStart?: (i: number, e: PointerEvent<SVGRectElement>) => void;
}) {
  const { rowH, scale, sumH, text, headerSize } = layout;
  const { centerY, waveY, sumY, atomsY } = rowsAt(y, layout);
  const labelGap = ("one unit cell".length * 0.6 * text) / 2 + 6;

  return (
    <g>
      <text
        x={x}
        y={y + 12}
        className="font-ui"
        fontSize={headerSize}
        fontWeight={600}
        fill={XR.sum}
      >
        {header}
      </text>

      <g stroke={XR.label} strokeWidth={1}>
        <line x1={x} x2={x} y1={centerY - 4} y2={atomsY + 6} />
        <line x1={x + w} x2={x + w} y1={centerY - 4} y2={atomsY + 6} />
      </g>
      {showCell && (
        <g>
          <g stroke={XR.label} strokeWidth={1}>
            <line x1={x} x2={x + w / 2 - labelGap} y1={centerY} y2={centerY} />
            <line x1={x + w / 2 + labelGap} x2={x + w} y1={centerY} y2={centerY} />
          </g>
          <text
            x={x + w / 2}
            y={centerY + 4}
            textAnchor="middle"
            className="font-mono"
            fontSize={text}
            fill={XR.label}
          >
            one unit cell
          </text>
        </g>
      )}

      <g stroke={XR.atom} strokeWidth={0.75} strokeDasharray="3 3">
        {ATOMS.map((a) => (
          <line key={a} x1={x + a * w} x2={x + a * w} y1={sumY - sumH / 2} y2={atomsY} />
        ))}
      </g>

      {WAVES.map((wave, i) => {
        const cy = waveY(i);
        const moved = Math.abs(wrap(shifts[i])) > 0.01;
        return (
          <g key={wave.h}>
            <line x1={x} x2={x + w} y1={cy} y2={cy} stroke={XR.rule} />
            {moved && !onDragStart && (
              <path
                d={curvePath(x, cy, w, (t) => scale * waveAt(i, t / w, 0), 1)}
                fill="none"
                stroke={XR.atom}
                strokeWidth={1.25}
                strokeDasharray="3 3"
              />
            )}
            <path
              d={curvePath(x, cy, w, (t) => scale * waveAt(i, t / w, shifts[i]), 1)}
              fill="none"
              stroke={XR.first}
              strokeWidth={dragging === i ? 3 : 2}
              strokeLinejoin="round"
            />
            {onDragStart && (
              <rect
                x={x}
                y={cy - rowH / 2}
                width={w}
                height={rowH}
                fill="transparent"
                style={{ cursor: dragging === i ? "grabbing" : "grab", touchAction: "pan-y" }}
                onPointerDown={(e) => onDragStart(i, e)}
              />
            )}
          </g>
        );
      })}

      <line x1={x} x2={x + w} y1={sumY} y2={sumY} stroke={XR.rule} />
      <path
        d={curvePath(x, sumY, w, (t) => scale * sumAt(t / w, shifts), 1)}
        fill="none"
        stroke={XR.accent}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
      {ATOMS.map((a) => (
        <circle key={a} cx={x + a * w} cy={atomsY} r={4} fill={XR.sum} />
      ))}
    </g>
  );
}

/** The film as a strip running out from its center, one spot per wave, each linked across to its wave. */
function Gutter({ y, w, layout }: { y: number; w: number; layout: Layout }) {
  const { rowH, text, narrow } = layout;
  const { centerY, waveY, sumY, atomsY } = rowsAt(y, layout);
  const stripW = narrow ? 18 : 22;
  const lineX = stripW + 4;
  const stripBottom = centerY + (WAVES.length + 0.5) * rowH;

  return (
    <g>
      <text x={0} y={y + 12} className="font-mono" fontSize={text} fill={XR.label}>
        film
      </text>
      <rect
        x={0}
        y={centerY - rowH / 2 + 4}
        width={stripW}
        height={stripBottom - (centerY - rowH / 2 + 4) - 4}
        fill={XR.film}
        stroke={XR.atom}
        strokeWidth={0.75}
      />
      <g stroke={XR.label} strokeWidth={1}>
        <line x1={stripW / 2 - 4} x2={stripW / 2 + 4} y1={centerY} y2={centerY} />
        <line x1={stripW / 2} x2={stripW / 2} y1={centerY - 4} y2={centerY + 4} />
      </g>
      <text x={lineX + 2} y={centerY + 4} className="font-mono" fontSize={text} fill={XR.label}>
        center
      </text>
      {WAVES.map(({ h, amp }, i) => {
        const cy = waveY(i);
        return (
          <g key={h}>
            <line
              x1={lineX}
              x2={w - 4}
              y1={cy}
              y2={cy}
              stroke={XR.atom}
              strokeWidth={0.75}
              strokeDasharray="2 3"
            />
            <circle
              cx={stripW / 2}
              cy={cy}
              r={Math.min(6, rowH / 4)}
              fill={XR.sum}
              fillOpacity={(amp / MAX_AMP) ** 2}
            />
          </g>
        );
      })}
      <text
        x={0}
        y={stripBottom + text}
        className="font-mono"
        fontSize={text - 1}
        fill={XR.label}
      >
        farther out
      </text>
      <g className="font-mono" fontSize={text}>
        <text x={0} y={sumY + 4} fill={XR.accent}>
          sum
        </text>
        <text x={0} y={atomsY + 4} fill={XR.label}>
          atoms
        </text>
      </g>
    </g>
  );
}

/** `headroom` is the share of the all-in-step height the sum row leaves room for. */
function useLayout(W: number, headroom = 0.62) {
  const narrow = W < 520;
  const gutter = narrow ? 84 : 96;
  const gap = narrow ? 0 : 24;
  const colW = narrow ? W - gutter : (W - gutter - gap) / 2;
  const rowH = narrow ? 32 : 34;
  const scale = (rowH * 0.36) / MAX_AMP;
  const layout: Layout = {
    rowH,
    scale,
    sumH: 2 * scale * WAVES.reduce((s, w) => s + w.amp, 0) * headroom,
    text: narrow ? 10 : 11,
    headerSize: narrow ? 11 : 12,
    narrow,
  };
  const blockH = rowsAt(0, layout).atomsY + 10;
  return { narrow, gutter, gap, colW, layout, blockH };
}

function Frame({
  W,
  shifts,
  otherHeader,
  dragging,
  onDragStart,
  title,
  desc,
  headroom,
}: {
  W: number;
  shifts: number[];
  otherHeader: string;
  dragging?: number | null;
  onDragStart?: (i: number, e: PointerEvent<SVGRectElement>) => void;
  title: string;
  desc: string;
  headroom?: number;
}) {
  const ids = useId();
  const { narrow, gutter, gap, colW, layout, blockH } = useLayout(W, headroom);
  const blocks = narrow
    ? [
        { x: gutter, y: 0 },
        { x: gutter, y: blockH + 24 },
      ]
    : [
        { x: gutter, y: 0 },
        { x: gutter + colW + gap, y: 0 },
      ];
  const H = (narrow ? 2 * blockH + 24 : blockH) + 2;

  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      className="block"
      role="img"
      aria-labelledby={`${ids}t ${ids}d`}
    >
      <title id={`${ids}t`}>{title}</title>
      <desc id={`${ids}d`}>{desc}</desc>
      <Gutter y={0} w={gutter} layout={layout} />
      {narrow && <Gutter y={blocks[1].y} w={gutter} layout={layout} />}
      <Column
        x={blocks[0].x}
        y={blocks[0].y}
        w={colW}
        shifts={RIGHT}
        header="Lined up right"
        layout={layout}
        showCell
      />
      <Column
        x={blocks[1].x}
        y={blocks[1].y}
        w={colW}
        shifts={shifts}
        header={otherHeader}
        layout={layout}
        dragging={dragging}
        onDragStart={onDragStart}
      />
    </svg>
  );
}

const TITLE =
  "The same four waves, lined up two ways, add up to two different pictures.";

export function WavesToPicture() {
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  return (
    <div ref={ref} className="w-full">
      <Frame
        W={W}
        shifts={OTHER}
        otherHeader="Lined up wrong"
        title={TITLE}
        desc="Four waves laid across one unit cell, one for each spot on the film; each spot farther from the film's center gives a finer wave. Added with the right phases, the sum peaks on the three atoms. With the second and fourth waves shifted half a wave, the film is unchanged but the sum peaks in three other places."
      />
    </div>
  );
}

export function WavesToPictureInteractive() {
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const [shifts, setShifts] = useState(OTHER);
  const [dragging, setDragging] = useState<number | null>(null);
  const drag = useRef<{ i: number; x0: number; s0: number } | null>(null);
  const { colW } = useLayout(W, 1);
  const matched = shifts.every((s) => Math.abs(wrap(s)) < 0.02);

  const onDragStart = (i: number, e: PointerEvent<SVGRectElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { i, x0: e.clientX, s0: shifts[i] };
    setDragging(i);
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    let s = wrap(d.s0 + ((e.clientX - d.x0) / colW) * WAVES[d.i].h);
    if (Math.abs(s) < 0.04) s = 0;
    setShifts((prev) => prev.map((v, j) => (j === d.i ? s : v)));
  };
  const onUp = () => {
    drag.current = null;
    setDragging(null);
  };

  return (
    <div
      ref={ref}
      className="w-full"
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      <Frame
        W={W}
        shifts={shifts}
        otherHeader={matched ? "Your phases: right" : "Your phases"}
        dragging={dragging}
        onDragStart={onDragStart}
        headroom={1}
        title={TITLE}
        desc={`Four waves laid across one unit cell, one for each spot on the film, each finer than the last. The right column adds them with phases you set by dragging each wave; ${matched ? "they now match, and the sum peaks on the atoms" : "the sum peaks on the atoms only when every wave is lined up right"}.`}
      />
    </div>
  );
}

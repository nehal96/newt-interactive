// Figure 1: two waves and their sum.
import { useId, useRef, useState, type PointerEvent } from "react";
import { useElementWidth } from "@hooks";
import { XR } from "./palette";
import { TAU, curvePath } from "./wave";
import { SliderRow } from "./controls";

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

/** Height of the sum of two unit waves `d` of a wavelength apart. */
const sumHeight = (d: number) => Math.abs(2 * Math.cos(Math.PI * d));

const trim = (v: number, digits: number) => String(+v.toFixed(digits));

type Rows = {
  w1: number;
  w2: number;
  sum: number;
  guideTop: number;
  guideBottom: number;
};

type Column = { x: number; w: number; lambda: number; amp: number };

function WaveColumn({
  col,
  rows,
  d,
  bracketLabel,
  wave2Width = 2,
}: {
  col: Column;
  rows: Rows;
  d: number;
  bracketLabel?: string;
  wave2Width?: number;
}) {
  const { x, w, lambda, amp } = col;
  const c0 = lambda / 2;
  const wave = (shift: number) => (t: number) =>
    amp * Math.cos((TAU * (t - c0 - shift)) / lambda);
  const w1 = wave(0);
  const w2 = wave(d * lambda);
  const crests: number[] = [];
  for (let c = c0; c <= w + 0.5; c += lambda) crests.push(c);

  const bracketY = rows.w2 - amp - 7;
  const bx0 = x + c0;
  const bx1 = x + c0 + d * lambda;

  return (
    <g>
      <g stroke={XR.atom} strokeWidth={0.75} strokeDasharray="3 3">
        {crests.map((c) => (
          <line
            key={c}
            x1={x + c}
            x2={x + c}
            y1={rows.guideTop}
            y2={rows.guideBottom}
          />
        ))}
      </g>
      <g stroke={XR.rule}>
        {[rows.w1, rows.w2, rows.sum].map((y) => (
          <line key={y} x1={x} x2={x + w} y1={y} y2={y} />
        ))}
      </g>
      <g fill="none" strokeLinejoin="round">
        <path d={curvePath(x, rows.w1, w, w1, 1)} stroke={XR.first} strokeWidth={2} />
        <path
          d={curvePath(x, rows.w2, w, w2, 1)}
          stroke={XR.first}
          strokeWidth={wave2Width}
        />
        <path
          d={curvePath(x, rows.sum, w, (t) => w1(t) + w2(t), 1)}
          stroke={XR.accent}
          strokeWidth={2.5}
        />
      </g>
      {d > 0.005 && (
        <g stroke={XR.label} strokeWidth={1}>
          <line x1={bx0} x2={bx1} y1={bracketY} y2={bracketY} />
          <line x1={bx0} x2={bx0} y1={bracketY - 3} y2={bracketY + 3} />
          <line x1={bx1} x2={bx1} y1={bracketY - 3} y2={bracketY + 3} />
        </g>
      )}
      {bracketLabel && d > 0.005 && (
        <text
          x={clamp((bx0 + bx1) / 2, x + 40, x + w - 40)}
          y={bracketY - 6}
          textAnchor="middle"
          className="font-mono"
          fontSize={10}
          fill={XR.label}
        >
          {bracketLabel}
        </text>
      )}
    </g>
  );
}

function WavelengthScale({ x, lambda, y }: { x: number; lambda: number; y: number }) {
  return (
    <g>
      <g stroke={XR.label} strokeWidth={1}>
        <line x1={x} x2={x + lambda} y1={y} y2={y} />
        <line x1={x} x2={x} y1={y - 3} y2={y + 3} />
        <line x1={x + lambda} x2={x + lambda} y1={y - 3} y2={y + 3} />
      </g>
      <text
        x={x + lambda / 2}
        y={y - 7}
        textAnchor="middle"
        className="font-mono"
        fontSize={10}
        fill={XR.label}
      >
        1 wavelength
      </text>
    </g>
  );
}

function RowLabels({
  rows,
  size,
  sumHeightLabel,
}: {
  rows: Rows;
  size: number;
  sumHeightLabel?: string;
}) {
  return (
    <g className="font-mono" fill={XR.label} fontSize={size}>
      <text x={0} y={rows.w1 + 4}>wave 1</text>
      <text x={0} y={rows.w1 + 18} fontSize={size - 1}>
        height 1
      </text>
      <text x={0} y={rows.w2 + 4}>wave 2</text>
      <text x={0} y={rows.w2 + 18} fontSize={size - 1}>
        height 1
      </text>
      <text x={0} y={rows.sum + 4} fill={XR.accent}>sum</text>
      {sumHeightLabel && (
        <text x={0} y={rows.sum + 18} fontSize={size - 1} fill={XR.accent}>
          {sumHeightLabel}
        </text>
      )}
    </g>
  );
}

const SHIFTS = [
  { d: 0, header: "In step" },
  { d: 0.25, header: "¼ wave apart" },
  { d: 0.5, header: "½ wave apart" },
];

export function TwoWaves() {
  const ids = useId();
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const narrow = W < 520;
  const labelW = narrow ? 54 : 72;
  const gap = narrow ? 12 : 24;
  const colW = (W - labelW - 2 * gap) / 3;
  const lambda = colW / 2;
  const amp = clamp(lambda * 0.2, 8, 16);
  const text = narrow ? 10 : 11;

  const guideTop = narrow ? 28 : 46;
  const w1 = guideTop + 8 + amp;
  const w2 = w1 + 2 * amp + 24;
  const sum = w2 + 3 * amp + 26;
  const rows: Rows = { w1, w2, sum, guideTop, guideBottom: sum + 2 * amp + 6 };
  const heightY = rows.guideBottom + 16;
  const H = heightY + 6;

  return (
    <div ref={ref} className="w-full">
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        className="block"
        role="img"
        aria-labelledby={`${ids}t ${ids}d`}
      >
        <title id={`${ids}t`}>
          Waves in step add up. Waves half a wave apart cancel out.
        </title>
        <desc id={`${ids}d`}>
          Three columns. In each, wave 1 and wave 2 have height 1 and the same
          wavelength, and wave 2 is shifted by none, a quarter, and a half of a
          wavelength. Added point by point, their sum has height 2, 1.41 and 0.
        </desc>

        <RowLabels rows={rows} size={text} />

        {SHIFTS.map(({ d, header }, i) => {
          const x = labelW + i * (colW + gap);
          return (
            <g key={d}>
              <text
                x={x}
                y={14}
                className="font-ui"
                fontSize={narrow ? 11 : 12}
                fontWeight={600}
                fill={XR.sum}
              >
                {header}
              </text>
              {i === 0 && !narrow && (
                <WavelengthScale x={x + lambda / 2} lambda={lambda} y={guideTop - 6} />
              )}
              <WaveColumn col={{ x, w: colW, lambda, amp }} rows={rows} d={d} />
              <text
                x={x + colW / 2}
                y={heightY}
                textAnchor="middle"
                className="font-mono"
                fontSize={text}
                fill={XR.accent}
              >
                height {trim(sumHeight(d), 2)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function header(d: number) {
  if (d <= 0.03) return "In step: crests line up";
  if (d >= 0.97) return "A whole wave apart: in step again";
  if (Math.abs(d - 0.5) <= 0.03) return "Half a wave apart: crest meets trough";
  return "Partly in step";
}

export function TwoWavesInteractive() {
  const ids = useId();
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const [d, setD] = useState(0.3);
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ x0: number; d0: number } | null>(null);

  const narrow = W < 520;
  const labelW = narrow ? 54 : 72;
  const waveW = W - labelW - 4;
  const lambda = waveW / 3;
  const amp = clamp(lambda * 0.16, 9, 16);
  const text = narrow ? 10 : 11;

  const guideTop = 46;
  const w1 = guideTop + 8 + amp;
  const w2 = w1 + 2 * amp + 30;
  const sum = w2 + 3 * amp + 26;
  const rows: Rows = { w1, w2, sum, guideTop, guideBottom: sum + 2 * amp + 6 };
  const H = rows.guideBottom + 4;
  const h = sumHeight(d);

  const onDown = (e: PointerEvent<SVGRectElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x0: e.clientX, d0: d };
    setDragging(true);
  };
  const onMove = (e: PointerEvent<SVGRectElement>) => {
    if (!drag.current) return;
    const next = drag.current.d0 + (e.clientX - drag.current.x0) / lambda;
    setD(Math.round(clamp(next, 0, 1) * 100) / 100);
  };
  const onUp = () => {
    drag.current = null;
    setDragging(false);
  };

  return (
    <div ref={ref} className="w-full">
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        className="block"
        role="img"
        aria-labelledby={`${ids}t ${ids}d`}
      >
        <title id={`${ids}t`}>
          Waves in step add up. Waves half a wave apart cancel out.
        </title>
        <desc id={`${ids}d`}>
          Wave 2 is shifted {d.toFixed(2)} of a wavelength from wave 1. Added
          point by point, their sum has height {h.toFixed(2)}, out of a possible
          2.
        </desc>

        <text
          x={labelW}
          y={14}
          className="font-ui"
          fontSize={narrow ? 11 : 12}
          fontWeight={600}
          fill={XR.sum}
        >
          {header(d)}
        </text>
        <WavelengthScale x={labelW + lambda / 2} lambda={lambda} y={guideTop - 6} />
        <RowLabels rows={rows} size={text} sumHeightLabel={`height ${h.toFixed(2)}`} />
        <WaveColumn
          col={{ x: labelW, w: waveW, lambda, amp }}
          rows={rows}
          d={d}
          bracketLabel={`${d.toFixed(2)} wavelength`}
          wave2Width={dragging ? 3 : 2}
        />

        <rect
          x={labelW}
          y={w2 - amp - 16}
          width={waveW}
          height={2 * amp + 32}
          fill="transparent"
          style={{ cursor: dragging ? "grabbing" : "grab", touchAction: "pan-y" }}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        />
      </svg>

      <div className="mt-5">
        <SliderRow
          label="Shift wave 2"
          value={d}
          display={`${d.toFixed(2)} of a wavelength`}
          min={0}
          max={1}
          step={0.01}
          onChange={setD}
        />
      </div>
    </div>
  );
}

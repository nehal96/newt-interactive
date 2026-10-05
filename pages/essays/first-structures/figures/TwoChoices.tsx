// One heavy atom leaves two possible directions for a spot's wave; a second heavy atom picks one.
import { useId } from "react";
import { useElementWidth } from "@hooks";
import { XR } from "./palette";
import { Note } from "./TwoAtoms";

type V = [number, number];
const add = (a: V, b: V): V => [a[0] + b[0], a[1] + b[1]];
const len = (a: V) => Math.hypot(a[0], a[1]);
const polar = (r: number, deg: number): V => [r * Math.cos((deg * Math.PI) / 180), r * Math.sin((deg * Math.PI) / 180)];

const PROTEIN_DEG = 60;
const PROTEIN = polar(1, PROTEIN_DEG);
const HEAVY_1_DEG = 200;
const HEAVY_1 = polar(0.45, HEAVY_1_DEG);
const HEAVY_2 = polar(0.42, 300);
/** The other direction that gives the same total length with the first heavy atom: the mirror image across its arrow. */
const MIRROR = polar(1, 2 * HEAVY_1_DEG - PROTEIN_DEG);
const MEASURED_1 = len(add(PROTEIN, HEAVY_1));
const MEASURED_2 = len(add(PROTEIN, HEAVY_2));
const REACH = 1.62;

function Arrow({ from, to, color, at, width = 2 }: { from: V; to: V; color: string; at: (v: V) => V; width?: number }) {
  const [x0, y0] = at(from);
  const [x1, y1] = at(to);
  const a = Math.atan2(y1 - y0, x1 - x0);
  const head = 7;
  const tx = x1 - head * Math.cos(a);
  const ty = y1 - head * Math.sin(a);
  return (
    <g stroke={color} fill={color} strokeWidth={width}>
      <line x1={x0} y1={y0} x2={tx} y2={ty} />
      <path
        d={`M${x1} ${y1}L${tx - 4 * Math.sin(a)} ${ty + 4 * Math.cos(a)}L${tx + 4 * Math.sin(a)} ${ty - 4 * Math.cos(a)}Z`}
        stroke="none"
      />
    </g>
  );
}

function Label({ v, at, color, children, dx = 0, dy = 0, anchor = "middle" }: {
  v: V;
  at: (v: V) => V;
  color: string;
  children: string;
  dx?: number;
  dy?: number;
  anchor?: "start" | "middle" | "end";
}) {
  const [x, y] = at(v);
  return (
    <text
      x={x + dx}
      y={y + dy}
      textAnchor={anchor}
      className="font-mono"
      fontSize={10}
      fill={color}
      style={{ paintOrder: "stroke", stroke: XR.card, strokeWidth: 3, strokeLinejoin: "round" }}
    >
      {children}
    </text>
  );
}

function Panel({ size, heavy, heavyName, heavyAt, measured }: {
  size: number;
  heavy: V;
  heavyName: string;
  heavyAt: { dx: number; dy: number; anchor: "start" | "end" };
  measured: number;
}) {
  const c = size / 2;
  const s = c / REACH;
  const at = ([x, y]: V): V => [c + x * s, c - y * s];
  const candidates: [V, string][] = [
    [PROTEIN, "1"],
    [MIRROR, "2"],
  ];
  return (
    <g>
      <circle cx={c} cy={c} r={s} fill="none" stroke={XR.first} strokeOpacity={0.45} strokeDasharray="3 4" />
      <circle cx={c} cy={c} r={measured * s} fill="none" stroke={XR.accent} strokeOpacity={0.6} strokeDasharray="3 4" />
      <circle cx={c} cy={c} r={2.5} fill={XR.label} />
      {candidates.map(([p, name]) => {
        const total = add(p, heavy);
        const fits = Math.abs(len(total) - measured) < 1e-6;
        return (
          <g key={name}>
            <g opacity={fits ? 1 : 0.35}>
              <Arrow from={[0, 0]} to={p} color={XR.first} at={at} />
              <Arrow from={p} to={total} color={XR.second} at={at} />
              <Arrow from={[0, 0]} to={total} color={XR.accent} at={at} width={1.5} />
            </g>
            <Label v={polar(1.26, (Math.atan2(p[1], p[0]) * 180) / Math.PI)} at={at} color={XR.first} dy={4}>
              {name}
            </Label>
          </g>
        );
      })}
      <Label v={add(PROTEIN, [heavy[0] / 2, heavy[1] / 2])} at={at} color={XR.second} {...heavyAt}>
        {heavyName}
      </Label>
      <Label v={[0, -1]} at={at} color={XR.first} dy={15}>
        protein
      </Label>
      <Label v={[0, -measured]} at={at} color={XR.accent} dy={-6}>
        measured length
      </Label>
    </g>
  );
}

export function TwoChoices() {
  const ids = useId();
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const sideBySide = W >= 560;
  const size = Math.min(300, sideBySide ? (W - 32) / 2 : W);
  const unit = size / 2 / REACH;
  const cropTop = size / 2 - 1.42 * unit;
  const cropH = 2.42 * unit + 22;
  return (
    <div ref={ref} className={sideBySide ? "grid w-full grid-cols-2 gap-8" : "flex w-full flex-col gap-8"}>
      <div className="flex flex-col">
        <Note title="1. One heavy atom: two answers">
          For most spots, the protein&apos;s wave can point in any direction, not just + or −.
          With the mercury&apos;s wave added, two directions give the measured length.
        </Note>
        <svg width={size} height={cropH} viewBox={`0 ${cropTop} ${size} ${cropH}`} className="mt-auto block pt-2" role="img" aria-labelledby={`${ids}a`}>
          <title id={`${ids}a`}>
            The protein&apos;s arrow could point anywhere around a circle. Adding the mercury&apos;s
            arrow, two directions give a total of the measured length.
          </title>
          <Panel
            size={size}
            heavy={HEAVY_1}
            heavyName="mercury"
            heavyAt={{ dx: -2, dy: -9, anchor: "end" }}
            measured={MEASURED_1}
          />
        </svg>
      </div>
      <div className="flex flex-col">
        <Note title="2. A second heavy atom picks one">
          A heavy atom in another place adds a different known wave. Only one of the two
          directions still gives the measured length.
        </Note>
        <svg width={size} height={cropH} viewBox={`0 ${cropTop} ${size} ${cropH}`} className="mt-auto block pt-2" role="img" aria-labelledby={`${ids}b`}>
          <title id={`${ids}b`}>
            With a second heavy atom, candidate 1 gives the measured total and candidate 2 does
            not.
          </title>
          <Panel
            size={size}
            heavy={HEAVY_2}
            heavyName="2nd heavy atom"
            heavyAt={{ dx: 14, dy: 14, anchor: "start" }}
            measured={MEASURED_2}
          />
        </svg>
      </div>
    </div>
  );
}

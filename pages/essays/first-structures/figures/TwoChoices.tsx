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
const REACH = 1.42;

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

function Panel({ size, heavy, heavyName, heavyAt, measured, verdicts }: {
  size: number;
  heavy: V;
  heavyName: string;
  heavyAt: { dx: number; dy: number; anchor: "start" | "end" };
  measured: number;
  verdicts?: [string, string];
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
      {candidates.map(([p, name], i) => {
        const total = add(p, heavy);
        const fits = Math.abs(len(total) - measured) < 1e-6;
        return (
          <g key={name} opacity={fits ? 1 : 0.4}>
            <Arrow from={[0, 0]} to={p} color={XR.first} at={at} />
            <Arrow from={p} to={total} color={XR.second} at={at} />
            <Arrow from={[0, 0]} to={total} color={XR.accent} at={at} width={1.5} />
            <Label v={polar(1.24, (Math.atan2(p[1], p[0]) * 180) / Math.PI + (verdicts && i ? -9 : 0))} at={at} color={XR.first} dy={4}>
              {verdicts ? `${name}: ${verdicts[i]}` : name}
            </Label>
          </g>
        );
      })}
      <Label v={add(PROTEIN, [heavy[0] / 2, heavy[1] / 2])} at={at} color={XR.second} {...heavyAt}>
        {heavyName}
      </Label>
      <Label v={[0, -1]} at={at} color={XR.first} dy={15}>
        protein: any direction
      </Label>
      <Label v={[0, -measured]} at={at} color={XR.accent} dy={-6}>
        total: measured length
      </Label>
    </g>
  );
}

export function TwoChoices() {
  const ids = useId();
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const sideBySide = W >= 560;
  const size = Math.min(300, sideBySide ? (W - 32) / 2 : W);
  return (
    <div ref={ref} className={sideBySide ? "grid w-full grid-cols-2 gap-8" : "flex w-full flex-col gap-8"}>
      <div>
        <Note title="1. One heavy atom: two answers">
          Off the symmetry axis a spot&apos;s wave can have any offset, so its arrow can point any
          way, not just + or −. With the mercury&apos;s arrow added, only two directions give the
          total its measured length.
        </Note>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mt-2 block" role="img" aria-labelledby={`${ids}a`}>
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
      <div>
        <Note title="2. A second heavy atom decides">
          A heavy atom somewhere else adds an arrow pointing another way. Only one of the two
          candidates gives that total its measured length too.
        </Note>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mt-2 block" role="img" aria-labelledby={`${ids}b`}>
          <title id={`${ids}b`}>
            With a second heavy atom, candidate 1 gives the measured total and candidate 2 does
            not.
          </title>
          <Panel
            size={size}
            heavy={HEAVY_2}
            heavyName="heavy atom 2"
            heavyAt={{ dx: 7, dy: -6, anchor: "start" }}
            measured={MEASURED_2}
            verdicts={["fits", "misses"]}
          />
        </svg>
      </div>
    </div>
  );
}

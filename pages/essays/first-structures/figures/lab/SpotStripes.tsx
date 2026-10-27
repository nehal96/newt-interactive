// Slide one atom across the box and mark where its wave reaches spot 3 in step: the marks are the spot's stripes.
import { useId, useState } from "react";
import { useElementWidth } from "@hooks";
import { XR } from "../palette";
import { TAU, curvePath } from "../wave";
import { Labels } from "../scene";
import { SliderRow } from "../controls";
import { Profile, stripe } from "./stripes";

const SPOT = 3;
const MINIS = [1, 2, 3, 6];
const frac = (v: number) => v - Math.floor(v);

export function SpotStripes() {
  const ids = useId();
  const uid = ids.replace(/:/g, "");
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const [x, setX] = useState(0.5);

  const narrow = W < 520;
  const text = narrow ? 10 : 11;
  const labelW = narrow ? 76 : 110;
  const bw = W - labelW - 4;
  const X = (v: number) => labelW + v * bw;

  const boxY = 8;
  const boxH = 50;
  const unit = narrow ? 7 : 8;
  const refY = boxY + boxH + 40;
  const atomY = refY + 2 * unit + 22;
  const H = atomY + unit + 10;
  const wl = bw / (narrow ? 2 : 3);
  const behind = frac(SPOT * x);
  const off = Math.min(behind, 1 - behind);
  const status = off < 0.04 ? "in step: a stripe" : Math.abs(behind - 0.5) < 0.04 ? "half a wave out: clear" : `${behind.toFixed(2)} of a wave behind`;
  const wave = (l: number) => (t: number) => unit * Math.cos(TAU * (t / wl - l));

  const miniGap = narrow ? 10 : 16;
  const miniW = (bw - miniGap * (MINIS.length - 1)) / MINIS.length;
  const miniX = (i: number) => labelW + i * (miniW + miniGap);
  const miniH = 30;
  const MH = miniH + 22;

  return (
    <div ref={ref} className="w-full">
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="block" role="img" aria-labelledby={`${ids}t ${ids}d`}>
        <title id={`${ids}t`}>Sliding an atom across the box: where its wave reaches spot 3 in step, a stripe is marked</title>
        <desc id={`${ids}d`}>
          The atom is {Math.round(x * 100)}% across the box. At spot 3 its wave arrives {behind.toFixed(2)} of a wave behind a
          wave from the left wall. Places where it arrives in step come round three times across the box, at 0%, 33% and 67%,
          and are marked as stripes.
        </desc>
        <defs>
          <Profile id={`${uid}s`} x0={X(0)} x1={X(1)} alpha={(v) => 0.6 * stripe(SPOT, v)} />
        </defs>

        <rect x={labelW} y={boxY} width={x * bw} height={boxH} fill={`url(#${uid}s)`} />
        <rect x={labelW} y={boxY} width={bw} height={boxH} fill="none" stroke={XR.atom} strokeWidth={0.75} strokeDasharray="3 3" />
        <circle cx={X(x)} cy={boxY + boxH / 2} r={6} fill={XR.second} />

        <g stroke={XR.atom} strokeWidth={1} strokeDasharray="2 3">
          {Array.from({ length: Math.floor(bw / wl) + 1 }, (_, i) => (
            <line key={i} x1={labelW + i * wl} x2={labelW + i * wl} y1={refY - unit - 6} y2={atomY + unit + 4} />
          ))}
        </g>
        <line x1={labelW} x2={labelW + bw} y1={refY} y2={refY} stroke={XR.rule} />
        <path d={curvePath(labelW, refY, bw, wave(0), 1)} fill="none" stroke={XR.label} strokeWidth={1.5} />
        <line x1={labelW} x2={labelW + bw} y1={atomY} y2={atomY} stroke={XR.rule} />
        <path d={curvePath(labelW, atomY, bw, wave(behind), 1)} fill="none" stroke={XR.second} strokeWidth={2} />

        <Labels size={text}>
          <text x={0} y={boxY + boxH / 2 + 4}>the box</text>
          <text x={labelW} y={refY - unit - 10}>
            {narrow ? "at spot 3:" : "the waves arriving at spot 3:"}
          </text>
          <text x={labelW + bw} y={refY - unit - 10} textAnchor="end" fill={off < 0.04 ? XR.first : XR.label}>
            {status}
          </text>
          <text x={0} y={refY + 4}>wall’s wave</text>
          <text x={0} y={atomY + 4} fill={XR.second}>
            atom’s wave
          </text>
        </Labels>
      </svg>

      <div className="mt-4">
        <SliderRow
          label="Slide the atom across the box"
          value={x}
          display={`${Math.round(x * 100)}% across`}
          min={0}
          max={1}
          step={0.005}
          onChange={setX}
        />
      </div>

      <div className="mt-6 border-t border-ink-200 pt-4">
        <p className="mb-2 font-ui text-xs text-ink-500">Every spot has its own stripes. The farther out the spot, the finer they are.</p>
        <svg width={W} height={MH} viewBox={`0 0 ${W} ${MH}`} className="block" role="img" aria-label="The stripes for spots 1, 2, 3 and 6: one, two, three and six stripes across the box">
          <defs>
            {MINIS.map((n, i) => (
              <Profile key={n} id={`${uid}m${n}`} x0={miniX(i)} x1={miniX(i) + miniW} alpha={(v) => 0.6 * stripe(n, v)} />
            ))}
          </defs>
          {MINIS.map((n, i) => (
            <g key={n}>
              <rect x={miniX(i)} y={2} width={miniW} height={miniH} fill={`url(#${uid}m${n})`} stroke={XR.atom} strokeWidth={0.75} strokeDasharray="3 3" />
            </g>
          ))}
          <Labels size={text}>
            <text x={0} y={2 + miniH / 2 + 4}>{narrow ? "stripes" : "their stripes"}</text>
            {MINIS.map((n, i) => (
              <text key={n} x={miniX(i) + miniW / 2} y={miniH + 18} textAnchor="middle">
                spot {n}
              </text>
            ))}
          </Labels>
        </svg>
      </div>
    </div>
  );
}

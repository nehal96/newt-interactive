// The same stripe sheets stacked twice: slid to their right places they draw the atoms; slid wrong, a molecule that isn't there.
import { useId, useState } from "react";
import { useElementWidth } from "@hooks";
import { Tabs, TabsList, TabsTrigger } from "@ui/controls";
import { XR } from "../palette";
import { Labels } from "../scene";
import { ATOMS, cellHeight, cellPhase } from "./cell";
import { Profile, stripe } from "./stripes";

const SPOTS = [1, 2, 3, 4, 5, 6];
const BOLD = SPOTS.map((n) => cellHeight(n, ATOMS));
const BOLDEST = Math.max(...BOLD);
/** Slides belonging to a different molecule, with atoms at 22%, 52% and 88%. */
const WRONG = SPOTS.map((n) => cellPhase(n, [0.22, 0.52, 0.88]));
const RIGHT = SPOTS.map((n) => cellPhase(n, ATOMS));

const piled = (shifts: number[], k: number) => (x: number) =>
  SPOTS.slice(0, k).reduce((acc, n, i) => acc + BOLD[i] * (2 * stripe(n, x, shifts[i]) - 1), 0);
const DARKEST = Math.max(...Array.from({ length: 201 }, (_, i) => piled(RIGHT, SPOTS.length)(i / 200)));

export function StackSheets() {
  const ids = useId();
  const uid = ids.replace(/:/g, "");
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const [k, setK] = useState(6);

  const narrow = W < 520;
  const text = narrow ? 10 : 11;
  const labelW = narrow ? 44 : 64;
  const gap = narrow ? 14 : 28;
  const cw = (W - labelW - gap - 4) / 2;
  const colX = [labelW, labelW + cw + gap];

  const headY = 12;
  const sheetH = 10;
  const sheetGap = 5;
  const pileY = headY + 14;
  const sheetY = (i: number) => pileY + i * (sheetH + sheetGap);
  const boxY = sheetY(SPOTS.length) + 26;
  const boxH = 44;
  const atomsY = boxY + boxH + 14;
  const H = atomsY + 20;

  const sides = [
    { shifts: RIGHT, head: narrow ? "right places" : "in the right places" },
    { shifts: WRONG, head: narrow ? "wrong places" : "in the wrong places" },
  ];

  return (
    <div ref={ref} className="w-full">
      <div className="mb-3 flex flex-wrap items-center gap-3 font-ui text-xs text-ink-500">
        <span>Sheets stacked</span>
        <Tabs value={String(k)} onValueChange={(v) => setK(Number(v))}>
          <TabsList className="h-8 bg-ink-200/60 p-0.5">
            {SPOTS.map((n) => (
              <TabsTrigger
                key={n}
                value={String(n)}
                className="px-2.5 py-1 font-ui text-xs text-ink-500 hover:bg-transparent data-[state=active]:bg-paper data-[state=active]:text-ink-900"
              >
                {n}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="block" role="img" aria-labelledby={`${ids}t ${ids}d`}>
        <title id={`${ids}t`}>The same stripe sheets, stacked in the right places and in the wrong places</title>
        <desc id={`${ids}d`}>
          {k} {k === 1 ? "sheet" : "sheets"} stacked. On the left, each sheet is slid to where it belongs, and the dark places
          {k >= 5 ? " sit on the three atoms" : " are still blurred"}. On the right, the same sheets are slid to the wrong
          places, and the dark places fall between the atoms.
        </desc>
        <defs>
          {sides.map(({ shifts }, s) => (
            <g key={s}>
              {SPOTS.map((n, i) => (
                <Profile
                  key={n}
                  id={`${uid}${s}s${n}`}
                  x0={colX[s]}
                  x1={colX[s] + cw}
                  alpha={(x) => (0.15 + (0.75 * BOLD[i]) / BOLDEST) * stripe(n, x, shifts[i])}
                />
              ))}
              <Profile id={`${uid}${s}b`} x0={colX[s]} x1={colX[s] + cw} alpha={(x) => 0.92 * Math.max(0, piled(shifts, k)(x) / DARKEST) ** 0.8} />
            </g>
          ))}
        </defs>

        {sides.map((_, s) => (
          <g key={s}>
            {SPOTS.map((n, i) =>
              n <= k ? (
                <rect key={n} x={colX[s]} y={sheetY(i)} width={cw} height={sheetH} fill={`url(#${uid}${s}s${n})`} stroke={XR.guide} strokeWidth={0.5} />
              ) : (
                <rect key={n} x={colX[s]} y={sheetY(i)} width={cw} height={sheetH} fill="none" stroke={XR.rule} strokeWidth={0.75} strokeDasharray="2 2" />
              ),
            )}
            <path
              d={`M${colX[s] + cw / 2} ${sheetY(SPOTS.length) + 2} v14 m-4 -5 l4 5 l4 -5`}
              fill="none"
              stroke={XR.label}
              strokeWidth={1}
            />
            <rect x={colX[s]} y={boxY} width={cw} height={boxH} fill={`url(#${uid}${s}b)`} />
            <rect x={colX[s]} y={boxY} width={cw} height={boxH} fill="none" stroke={XR.guide} strokeWidth={0.75} strokeDasharray="3 3" />
            <g stroke={XR.label} strokeWidth={0.75} strokeDasharray="2 3">
              {ATOMS.map((x) => (
                <line key={x} x1={colX[s] + x * cw} x2={colX[s] + x * cw} y1={boxY - 4} y2={atomsY} />
              ))}
            </g>
            {ATOMS.map((x) => (
              <circle key={x} cx={colX[s] + x * cw} cy={atomsY} r={4} fill={XR.ink} />
            ))}
          </g>
        ))}

        <Labels size={text}>
          {sides.map(({ head }, s) => (
            <text key={s} x={colX[s]} y={headY} fill={s ? XR.accent : XR.ink}>
              {head}
            </text>
          ))}
          {SPOTS.map((n, i) => (
            <text key={n} x={0} y={sheetY(i) + sheetH - 1} fill={n <= k ? XR.label : XR.guide}>
              spot {n}
            </text>
          ))}
          <text x={0} y={boxY + boxH / 2 + 4}>stack</text>
          <text x={0} y={atomsY + 4}>atoms</text>
        </Labels>
      </svg>
    </div>
  );
}

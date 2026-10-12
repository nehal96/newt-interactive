// Every window of α against every window of β, colored by its score, with the
// low scores counted by register shift.
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { cn } from "@lib/utils";
import { FITCH_1966 } from "../../core/fitch";
import Panel from "../Panel";
import { RW } from "../palette";
import { ALPHA, BETA, WINDOW, alphaBeta } from "./data";
import WindowStrip from "./WindowStrip";
import { WindowScore } from "./WindowPair";

const PX = 4;
const AXIS = 28;

const hex = (h: string) => [1, 3, 5].map((k) => parseInt(h.slice(k, k + 2), 16));
const mix = (a: string, b: string, t: number) => {
  const [x, y] = [hex(a), hex(b)];
  return `rgb(${x.map((v, k) => Math.round(v + (y[k] - v) * t)).join(",")})`;
};

export default function WindowMap() {
  const { mrs, shifts } = alphaBeta();
  const rows = mrs.length;
  const cols = mrs[0].length;
  const canvas = useRef<HTMLCanvasElement>(null);
  const [sel, setSel] = useState<[number, number]>([80, 85]);
  const [shift, setShift] = useState<number | null>(null);
  const cut = FITCH_1966.cutoff;

  useEffect(() => {
    const c = canvas.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    const dpr = window.devicePixelRatio || 1;
    c.width = cols * PX * dpr;
    c.height = rows * PX * dpr;
    ctx.scale(dpr, dpr);
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const v = mrs[i][j];
        const dim = shift !== null && i - j !== shift;
        const fade = Math.min(1, (v - cut) / 18);
        if (v <= cut) ctx.fillStyle = dim ? RW.matchEdge : RW.match;
        else ctx.fillStyle = mix(RW.faint, RW.paper, dim ? 0.5 + fade / 2 : fade);
        ctx.fillRect(j * PX, i * PX, PX, PX);
      }
    }
  }, [mrs, rows, cols, cut, shift]);

  const pick = (e: PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const j = Math.floor(((e.clientX - r.left) / r.width) * cols);
    const i = Math.floor(((e.clientY - r.top) / r.height) * rows);
    if (i >= 0 && i < rows && j >= 0 && j < cols) setSel([i, j]);
  };

  const [si, sj] = sel;
  const ours = new Map(shifts.map((h) => [h.shift, h]));
  const his = new Map<number, (typeof FITCH_1966.shifts)[number]>(FITCH_1966.shifts.map((h) => [h.shift, h]));
  const rowsOfTable = Array.from(new Set([...Array.from(ours.keys()), ...Array.from(his.keys())])).sort(
    (x, y) => x - y
  );
  const homologous: readonly number[] = FITCH_1966.homologous;

  return (
    <Panel>
      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        <div className="shrink-0" style={{ width: "100%", maxWidth: cols * PX + AXIS }}>
          <div className="mb-1 pl-7 font-ui text-xs text-ink-500">β window starts at 1 … {cols} →</div>
          <div className="flex">
            <div className="flex w-7 shrink-0 items-start justify-center pt-1 font-ui text-xs text-ink-500 [writing-mode:vertical-rl]">
              α window starts at 1 … {rows} →
            </div>
            <div className="relative min-w-0 flex-1">
              <canvas
                ref={canvas}
                onPointerMove={pick}
                onPointerDown={pick}
                className="block w-full cursor-crosshair touch-none"
                style={{ aspectRatio: `${cols} / ${rows}` }}
                role="img"
                aria-label={`Scores of all ${rows * cols} pairs of windows. Green squares score ${cut} or less.`}
              />
              <svg
                viewBox={`0 0 ${cols * PX} ${rows * PX}`}
                className="pointer-events-none absolute inset-0 h-full w-full"
                aria-hidden
              >
                <rect
                  x={sj * PX - 1.5}
                  y={si * PX - 1.5}
                  width={PX + 3}
                  height={PX + 3}
                  fill="none"
                  stroke={RW.focus}
                  strokeWidth={1.5}
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="min-w-0 flex-1 font-ui text-[13px] text-ink-600">
          <p className="text-sm text-ink-900">
            {shifts.reduce((n, h) => n + h.count, 0)} windows score {cut} or less; Fitch found{" "}
            {FITCH_1966.shifts.reduce((n, h) => n + h.count, 0)}
          </p>
          <table className="mt-3 w-full tabular-nums">
            <thead className="text-xs text-ink-500">
              <tr>
                <th className="pb-1 text-left font-normal">Shift</th>
                <th className="pb-1 pl-2 text-right font-normal">Here</th>
                <th className="pb-1 pl-2 text-right font-normal">β starts</th>
                <th className="pb-1 pl-3 text-right font-normal">Fitch</th>
                <th className="pb-1 pl-2 text-right font-normal">β starts</th>
              </tr>
            </thead>
            <tbody>
              {rowsOfTable.map((s) => {
                const o = ours.get(s);
                const h = his.get(s);
                const real = homologous.includes(s);
                return (
                  <tr
                    key={s}
                    onPointerEnter={() => setShift(s)}
                    onPointerLeave={() => setShift(null)}
                    className={cn("cursor-default", shift === s && "bg-ink-100", !real && "text-ink-500")}
                  >
                    <td className="py-px">{s > 0 ? `+${s}` : s}</td>
                    <td
                      className={cn("py-px pl-2 text-right", real && "font-semibold")}
                      style={real ? { color: RW.matchInk } : undefined}
                    >
                      {o?.count ?? "–"}
                    </td>
                    <td className="py-px pl-2 text-right">{o ? `${o.from}–${o.to}` : ""}</td>
                    <td className={cn("py-px pl-3 text-right", real && "font-semibold text-ink-900")}>
                      {h?.count ?? "–"}
                    </td>
                    <td className="py-px pl-2 text-right">{h ? `${h.beta[0]}–${h.beta[1]}` : ""}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="mt-3 text-ink-500">Point at a shift to light up its diagonal.</p>
        </div>
      </div>

      <div className="mt-5 border-t border-ink-100 pt-5">
        <WindowStrip top={ALPHA} bottom={BETA} i={si} j={sj} length={WINDOW} />
        <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4">
          <WindowScore value={mrs[si][sj]} />
          <span className="font-ui text-sm tabular-nums text-ink-500">register shift {si - sj}</span>
        </div>
      </div>
    </Panel>
  );
}

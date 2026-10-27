// The atoms in one cell, the extra distance each one's wave travels to a spot on the film, and how those waves add there.
import { useId, useState } from "react";
import { useElementWidth } from "@hooks";
import { Tabs, TabsList, TabsTrigger } from "@ui/controls";
import { XR } from "../palette";
import { TAU, curvePath } from "../wave";
import { BeamArrow, Labels } from "../scene";
import { Readouts, SliderRow } from "../controls";
import { ATOMS, cellHeight, lag } from "./cell";

const SPOTS = [1, 2, 3, 4, 5, 6];
/** The cell is this many wavelengths tall, so spot n leaves at sin θ = n / CELL. */
const CELL = 9;
const frac = (v: number) => v - Math.floor(v);
const colour = (i: number) => (i === 1 ? XR.second : XR.first);

type Pt = { x: number; y: number };

/** Rays toward spot n from atoms at heights `ay`: where each meets the level line, and where they land together on the film. */
function rays(n: number, ax: number, ay: number[], filmX: number) {
  const s = n / CELL;
  const c = Math.sqrt(1 - s * s);
  const ends: Pt[] = ay.map((y) => {
    const e = (y - ay[0]) * s;
    return { x: ax + e * c, y: y - e * s };
  });
  const lead = 34;
  const mid = {
    x: (ends[0].x + ends[2].x) / 2 + lead * c,
    y: (ends[0].y + ends[2].y) / 2 - lead * s,
  };
  const t = (filmX - mid.x) / c;
  return { s, c, ends, lead, mid, hit: { x: filmX, y: mid.y - t * s } };
}

export function AtomWaves() {
  const ids = useId();
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const [spot, setSpot] = useState(3);
  const [mid, setMid] = useState(ATOMS[1]);
  const atoms = [ATOMS[0], mid, ATOMS[2]];

  const narrow = W < 520;
  const side = W >= 600;
  const text = narrow ? 10 : 11;

  // Geometry, laid out from the cell's top edge at y = 0, then shifted down to fit.
  const a = narrow ? 150 : 180;
  const lam = a / CELL;
  const ax = 52;
  const filmX = ax + (narrow ? 150 : 170);
  const axis = ((ATOMS[0] + ATOMS[2]) / 2) * a;
  const fixed = [ATOMS[0], ATOMS[1], ATOMS[2]].map((f) => f * a);
  const highest = rays(SPOTS[SPOTS.length - 1], ax, fixed, filmX).hit.y;
  const dy = 34 - highest;
  const ay = atoms.map((f) => f * a + dy);
  const geoH = a + dy + 22;
  const geoW = filmX + 46;

  const r = rays(spot, ax, ay, filmX);
  const spotHits = SPOTS.map((k) => rays(k, ax, ay, filmX).hit);

  const extra = atoms.map((x) => lag(spot, x) - lag(spot, atoms[0]));
  const height = cellHeight(spot, atoms);

  const wiggle = (i: number) => {
    const e = (ay[i] - ay[0]) * r.s;
    let d = "";
    for (let t = 0; t <= e; t += 1) {
      const off = 3.5 * Math.sin((TAU * t) / lam);
      d += `${t ? "L" : "M"}${(ax + t * r.c + off * r.s).toFixed(1)} ${(ay[i] - t * r.s + off * r.c).toFixed(1)}`;
    }
    return d;
  };

  // The waves arriving at the spot, and their sum.
  const amp = 6;
  const wx = side ? geoW + 18 : 0;
  const labelW = narrow ? 66 : 74;
  const waveW = Math.min(W - wx - labelW - 4, 260);
  const wl = waveW / 2;
  const rowGap = 2 * amp + 22;
  const blockH = 3 * rowGap + 3 * amp + 10;
  const wy = side ? Math.max(14, (geoH - blockH) / 2) + amp : geoH + 22 + amp;
  const rows = [0, 1, 2].map((i) => wy + i * rowGap);
  const sumY = rows[2] + rowGap + 2 * amp;
  const wave = (l: number) => (t: number) => amp * Math.cos(TAU * (t / wl - l));
  const sum = (t: number) => extra.reduce((acc, l) => acc + wave(frac(l))(t), 0);
  const H = side ? geoH : sumY + 3 * amp + 10;

  return (
    <div ref={ref} className="w-full">
      <div className="mb-3 flex flex-wrap items-center gap-3 font-ui text-xs text-ink-500">
        <span>Spot</span>
        <Tabs value={String(spot)} onValueChange={(v) => setSpot(Number(v))}>
          <TabsList className="h-8 bg-ink-200/60 p-0.5">
            {SPOTS.map((k) => (
              <TabsTrigger
                key={k}
                value={String(k)}
                className="px-2.5 py-1 font-ui text-xs text-ink-500 hover:bg-transparent data-[state=active]:bg-paper data-[state=active]:text-ink-900"
              >
                {k}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <span>counting up the film from the beam</span>
      </div>

      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="block" role="img" aria-labelledby={`${ids}t ${ids}d`}>
        <title id={`${ids}t`}>Each atom's wave travels a different extra distance to a spot, and the spot's darkness is their sum</title>
        <desc id={`${ids}d`}>
          Toward spot {spot}, atom 2's wave travels {extra[1].toFixed(2)} wavelengths farther than atom 1's, and atom 3's
          travels {extra[2].toFixed(2)} farther. Arriving shifted by those amounts, the three waves add to a height of{" "}
          {height.toFixed(2)} of a possible 3, so the spot's darkness is {(height * height).toFixed(1)} of 9.
        </desc>

        <rect x={ax - 12} y={dy} width={24} height={a} fill="none" stroke={XR.guide} strokeWidth={0.75} strokeDasharray="3 3" />
        {ay.map((y) => (
          <BeamArrow key={y} x0={0} x1={ax - 7} y={y} />
        ))}
        <line x1={ax + 14} x2={filmX - 14} y1={axis + dy} y2={axis + dy} stroke={XR.first} strokeOpacity={0.3} strokeWidth={1.5} />
        <rect x={filmX - 14} y={axis + dy - 6} width={5} height={12} rx={1} fill={XR.label} />

        <g strokeWidth={1}>
          {ay.map((y, i) => (
            <line
              key={i}
              x1={ax}
              y1={y}
              x2={r.ends[i].x + r.lead * r.c}
              y2={r.ends[i].y - r.lead * r.s}
              stroke={colour(i)}
              strokeOpacity={0.7}
            />
          ))}
        </g>
        <line
          x1={ax}
          y1={ay[0]}
          x2={r.ends[2].x + 8 * r.s}
          y2={r.ends[2].y + 8 * r.c}
          stroke={XR.label}
          strokeWidth={1}
          strokeDasharray="4 3"
        />
        <line x1={r.mid.x} y1={r.mid.y} x2={r.hit.x - 2} y2={r.hit.y} stroke={XR.ink} strokeWidth={1.5} />
        <g fill="none" stroke={XR.accent} strokeWidth={2} strokeLinecap="round">
          <path d={wiggle(1)} />
          <path d={wiggle(2)} />
        </g>
        {ay.map((y, i) => (
          <circle key={i} cx={ax} cy={y} r={4.5} fill={i === 1 ? XR.second : XR.ink} />
        ))}

        <rect x={filmX} y={spotHits[SPOTS.length - 1].y - 12} width={7} height={axis + dy + 24 - (spotHits[SPOTS.length - 1].y - 12)} fill={XR.film} stroke={XR.guide} strokeWidth={0.75} />
        {SPOTS.map((k, i) => {
          const b = cellHeight(k, atoms) ** 2 / 9;
          return (
            <g key={k}>
              <circle cx={filmX + 3.5} cy={spotHits[i].y} r={4} fill={XR.ink} fillOpacity={0.05 + 0.92 * b} />
              {k === spot && <circle cx={filmX + 3.5} cy={spotHits[i].y} r={7.5} fill="none" stroke={XR.accent} strokeWidth={1.5} />}
            </g>
          );
        })}

        {extra.map((l, i) => (
          <g key={i}>
            <line x1={wx + labelW} x2={wx + labelW + waveW} y1={rows[i]} y2={rows[i]} stroke={XR.rule} />
            <path d={curvePath(wx + labelW, rows[i], waveW, wave(frac(l)), 1)} fill="none" stroke={colour(i)} strokeWidth={1.75} />
          </g>
        ))}
        <line x1={wx + labelW} x2={wx + labelW + waveW} y1={sumY} y2={sumY} stroke={XR.rule} />
        <path d={curvePath(wx + labelW, sumY, waveW, sum, 1)} fill="none" stroke={XR.accent} strokeWidth={2.25} />

        <Labels size={text}>
          <text x={0} y={ay[0] - 10}>x-rays</text>
          <text x={ax} y={dy + a + 16} textAnchor="middle">one cell</text>
          <text x={filmX + 3.5} y={spotHits[SPOTS.length - 1].y - 18} textAnchor="middle">film</text>
          <text x={filmX + 14} y={r.hit.y + 4} fill={XR.accent}>spot {spot}</text>
          {[1, 2].map((i) => (
            <text key={i} x={r.ends[i].x + 12 * r.s + 3} y={r.ends[i].y + 12 * r.c + 4} fill={XR.accent}>
              {extra[i].toFixed(2)}
            </text>
          ))}
          {extra.map((l, i) => (
            <g key={i} fill={colour(i)}>
              <text x={wx} y={rows[i] + 4}>atom {i + 1}</text>
              <text x={wx} y={rows[i] + 16} fontSize={text - 1} fill={i ? XR.accent : XR.label}>
                {i ? `${l.toFixed(2)} farther` : "reference"}
              </text>
            </g>
          ))}
          <text x={wx} y={sumY + 4} fill={XR.accent}>sum</text>
          <text x={wx} y={sumY + 16} fontSize={text - 1} fill={XR.accent}>
            height {height.toFixed(2)}
          </text>
        </Labels>
      </svg>

      <div className="mt-4">
        <SliderRow
          label="Move atom 2"
          value={mid}
          display={`${Math.round(mid * 100)}% of the way down the cell`}
          min={0.2}
          max={0.55}
          step={0.01}
          onChange={setMid}
        />
      </div>
      <Readouts items={[["Darkness of spot " + spot + ", height²", `${(height * height).toFixed(1)} of 9`]]} />
    </div>
  );
}

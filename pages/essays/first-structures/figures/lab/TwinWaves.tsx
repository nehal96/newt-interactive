// The two same-film molecules' summed waves at one spot: exactly as tall, with their crests in different places.
import { useId, useState } from "react";
import { useElementWidth } from "@hooks";
import { Tabs, TabsList, TabsTrigger } from "@ui/controls";
import { XR } from "../palette";
import { TAU, curvePath } from "../wave";
import { Labels } from "../scene";
import { Readouts } from "../controls";
import { ATOMS, FLIPPED, cellHeight, cellPhase } from "./cell";

const SPOTS = [1, 2, 3, 4, 5, 6];

export function TwinWaves() {
  const ids = useId();
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const [spot, setSpot] = useState(4);

  const narrow = W < 520;
  const text = narrow ? 10 : 11;
  const labelW = narrow ? 76 : 100;
  const ww = W - labelW - 4;
  const wl = ww / 2;
  const unit = narrow ? 9 : 11;

  const mols = [
    { atoms: ATOMS, name: "molecule A" },
    { atoms: FLIPPED, name: "molecule B" },
  ];
  const h = cellHeight(spot, ATOMS);
  const crest = mols.map(({ atoms }) => cellPhase(spot, atoms));
  const amp = h * unit;
  const rowGap = 2 * 3 * unit + 30;
  const rows = [18 + 3 * unit, 18 + 3 * unit + rowGap];
  const H = rows[1] + 3 * unit + 26;
  const crestX = (p: number, k: number) => labelW + (p + k) * wl;

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
      </div>

      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="block" role="img" aria-labelledby={`${ids}t ${ids}d`}>
        <title id={`${ids}t`}>At every spot, the two molecules' waves are exactly as tall, with their crests in different places</title>
        <desc id={`${ids}d`}>
          At spot {spot}, both molecules' summed waves have height {h.toFixed(2)}, so the spot is equally dark. Molecule A's
          crests fall {crest[0].toFixed(2)} of a wave along; molecule B's, {crest[1].toFixed(2)}.
        </desc>

        {mols.map((m, r) => (
          <g key={m.name}>
            <line x1={labelW} x2={labelW + ww} y1={rows[r]} y2={rows[r]} stroke={XR.rule} />
            <g stroke={XR.label} strokeWidth={1} strokeDasharray="4 3">
              <line x1={labelW} x2={labelW + ww} y1={rows[r] - amp} y2={rows[r] - amp} />
              <line x1={labelW} x2={labelW + ww} y1={rows[r] + amp} y2={rows[r] + amp} />
            </g>
            <path
              d={curvePath(labelW, rows[r], ww, (t) => amp * Math.cos(TAU * (t / wl - crest[r])), 1)}
              fill="none"
              stroke={XR.accent}
              strokeWidth={2.5}
            />
            {[0, 1].map((k) =>
              crestX(crest[r], k) <= labelW + ww ? (
                <circle key={k} cx={crestX(crest[r], k)} cy={rows[r] - amp} r={4} fill={XR.accent} />
              ) : null,
            )}
          </g>
        ))}
        <g stroke={XR.accent} strokeWidth={1} strokeDasharray="2 3" strokeOpacity={0.6}>
          {[0, 1].map((r) => (
            <line
              key={r}
              x1={crestX(crest[r], 0)}
              x2={crestX(crest[r], 0)}
              y1={rows[0] - amp - 10}
              y2={rows[1] + amp + 10}
            />
          ))}
        </g>

        <Labels size={text}>
          {mols.map((m, r) => (
            <g key={m.name}>
              <text x={0} y={rows[r] + 4} fill={XR.sum}>{m.name}</text>
              <text x={0} y={rows[r] + 17} fontSize={text - 1}>
                height {h.toFixed(2)}
              </text>
            </g>
          ))}
          <text x={labelW + ww} y={rows[0] - amp - 6} textAnchor="end">
            same height: same darkness
          </text>
        </Labels>
      </svg>

      <Readouts
        items={[
          [`Spot ${spot} darkness, A and B`, `${(h * h).toFixed(1)} and ${(cellHeight(spot, FLIPPED) ** 2).toFixed(1)}`],
          ["First crest, A and B", `${crest[0].toFixed(2)} and ${crest[1].toFixed(2)} of a wave along`],
        ]}
      />
    </div>
  );
}

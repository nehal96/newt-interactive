// Matches on every diagonal of a diagram against what chance would put there,
// raw or as running sums over neighboring diagonals.
import { smoothed, type Diagonal } from "../../core/diagram";
import { RW } from "../palette";
import { useWidth } from "../useWidth";

const H = 90;
const PAD = { top: 14, bottom: 22, left: 28 };

export default function DiagonalProfile({
  diagonals,
  chance,
  width: span = 1,
  focus = 0,
  onFocus,
  yMax,
}: {
  diagonals: Diagonal[];
  /** Chance of a dot in any one cell. */
  chance: number;
  /** How many neighboring diagonals each point sums. */
  width?: number;
  focus?: number | null;
  onFocus?: (d: number | null) => void;
  yMax?: number;
}) {
  const [ref, avail] = useWidth<HTMLDivElement>();
  const w = Math.max(260, avail || 600);
  const observed = smoothed(
    diagonals.map((g) => g.matches),
    span
  );
  const expected = smoothed(
    diagonals.map((g) => g.cells * chance),
    span
  );
  const top = yMax ?? Math.max(4, ...observed.map((v) => v ?? 0)) * 1.1;
  const bw = (w - PAD.left) / diagonals.length;
  const x = (k: number) => PAD.left + k * bw;
  const y = (v: number) => PAD.top + H - (Math.min(v, top) / top) * H;
  const zero = diagonals.findIndex((g) => g.d === 0);
  const fk = focus === null ? -1 : diagonals.findIndex((g) => g.d === focus);

  const line = (vals: (number | null)[]) =>
    vals
      .map((v, k) => (v === null ? null : `${x(k) + bw / 2},${y(v)}`))
      .filter(Boolean)
      .map((pt, k) => `${k ? "L" : "M"}${pt}`)
      .join(" ");

  const tick = Math.max(1, Math.round(top / 3 / 5) * 5);

  return (
    <div ref={ref}>
      <svg
        width={w}
        height={H + PAD.top + PAD.bottom}
        className="block font-ui"
        role="img"
        aria-label={span > 1 ? `Running sums of ${span} adjacent diagonals` : "Matches on each diagonal"}
        onPointerMove={
          onFocus
            ? (e) => {
                const box = e.currentTarget.getBoundingClientRect();
                const k = Math.floor((e.clientX - box.left - PAD.left) / bw);
                onFocus(k >= 0 && k < diagonals.length ? diagonals[k].d : null);
              }
            : undefined
        }
        onPointerLeave={onFocus ? () => onFocus(null) : undefined}
      >
        {[0, tick, tick * 2, tick * 3]
          .filter((t) => t <= top)
          .map((t) => (
            <g key={t}>
              <line x1={PAD.left} x2={w} y1={y(t)} y2={y(t)} stroke={RW.wash} />
              <text x={PAD.left - 5} y={y(t) + 4} textAnchor="end" fontSize={10} fill={RW.label}>
                {t}
              </text>
            </g>
          ))}
        {span === 1 ? (
          observed.map((v, k) =>
            v ? (
              <rect
                key={k}
                x={x(k) + bw * 0.1}
                y={y(v)}
                width={Math.max(0.8, bw * 0.8)}
                height={PAD.top + H - y(v)}
                fill={k === fk ? RW.match : RW.faint}
              />
            ) : null
          )
        ) : (
          <path d={line(observed)} fill="none" stroke={RW.residue} strokeWidth={1.25} strokeLinejoin="round" />
        )}
        <path d={line(expected)} fill="none" stroke={RW.label} strokeWidth={1.25} strokeDasharray="3 2" />
        {fk >= 0 && span > 1 && observed[fk] !== null && (
          <circle cx={x(fk) + bw / 2} cy={y(observed[fk] as number)} r={3} fill={RW.match} />
        )}
        <text x={x(zero) + bw / 2} y={PAD.top + H + 14} textAnchor="middle" fontSize={10} fill={RW.label}>
          0
        </text>
        <text x={PAD.left} y={PAD.top + H + 14} fontSize={10} fill={RW.faint}>
          ←
        </text>
        <text x={w} y={PAD.top + H + 14} textAnchor="end" fontSize={10} fill={RW.faint}>
          →
        </text>
        {fk >= 0 && observed[fk] !== null && (
          <text
            x={Math.min(w - 4, Math.max(PAD.left + 40, x(fk) + bw / 2))}
            y={PAD.top - 3}
            textAnchor="middle"
            fontSize={11}
            fill={RW.matchInk}
          >
            diagonal {focus}: {observed[fk]}
          </text>
        )}
      </svg>
    </div>
  );
}

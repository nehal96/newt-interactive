// A wave of known size and sign, added to the protein's, shows which way the protein's points.
import { useId } from "react";
import { useElementWidth } from "@hooks";
import { XR } from "./palette";
import { Note } from "./TwoAtoms";

const PROTEIN = 1;
const KNOWN = 0.5;
const MAX_DARKNESS = (PROTEIN + KNOWN) ** 2;

const TEXT = {
  liquid: {
    name: "liquid",
    add: "Swapping salt for water changes the liquid's wave by an amount that can be worked out. If the spot darkens, the protein's wave points the same way; if it fades, the other way.",
  },
  mercury: {
    name: "mercury",
    add: "Once the mercury's place is found, its wave can be worked out. If the spot darkens, the protein's wave points the same way; if it fades, the other way.",
  },
} as const;

function Arrow({
  x0,
  x1,
  y,
  color,
  width = 2,
  dashed = false,
}: {
  x0: number;
  x1: number;
  y: number;
  color: string;
  width?: number;
  dashed?: boolean;
}) {
  const dir = Math.sign(x1 - x0) || 1;
  const head = 6;
  return (
    <g
      stroke={color}
      fill={color}
      strokeWidth={width}
      opacity={dashed ? 0.55 : 1}
    >
      <line
        x1={x0}
        x2={x1 - dir * head}
        y1={y}
        y2={y}
        strokeDasharray={dashed ? "4 3" : undefined}
      />
      <path
        d={`M${x1} ${y} L${x1 - dir * head * 1.4} ${y - head * 0.75} L${x1 - dir * head * 1.4} ${y + head * 0.75}Z`}
        stroke="none"
      />
    </g>
  );
}

function Spot({ x, y, darkness }: { x: number; y: number; darkness: number }) {
  const s = 26;
  return (
    <g>
      <rect
        x={x}
        y={y - s / 2}
        width={s}
        height={s}
        fill={XR.film}
        stroke={XR.atom}
        strokeWidth={0.75}
      />
      <circle
        cx={x + s / 2}
        cy={y}
        r={5}
        fill={XR.sum}
        fillOpacity={darkness / MAX_DARKNESS}
      />
    </g>
  );
}

type Row = {
  label: string;
  arrows: {
    from: number;
    to: number;
    color: string;
    dy: number;
    dashed?: boolean;
    name?: string;
    nameAt?: "above" | "below" | "start";
  }[];
  darkness: number;
};

function Rows({ rows, title }: { rows: Row[]; title: string }) {
  const ids = useId();
  const [ref, W] = useElementWidth<HTMLDivElement>(300);
  const labelW = 40;
  const spotW = 34;
  const lineW = W - labelW - spotW - 8;
  const zero = labelW + lineW / 2;
  const unit = (lineW / 2 - 8) / (PROTEIN + KNOWN);
  const rowH = 52;
  const pad = 10;
  const H = rows.length * rowH + pad;

  return (
    <div ref={ref} className="w-full">
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        className="block"
        role="img"
        aria-labelledby={`${ids}t`}
      >
        <title id={`${ids}t`}>{title}</title>
        {rows.map(({ label, arrows, darkness }, i) => {
          const y = pad + i * rowH + rowH / 2;
          return (
            <g key={label}>
              <text
                x={0}
                y={y + 4}
                className="font-mono"
                fontSize={10}
                fill={XR.label}
              >
                {label}
              </text>
              <line
                x1={labelW}
                x2={labelW + lineW}
                y1={y}
                y2={y}
                stroke={XR.rule}
              />
              <line
                x1={zero}
                x2={zero}
                y1={y - 12}
                y2={y + 12}
                stroke={XR.atom}
                strokeWidth={0.75}
              />
              {arrows.map((a, j) => (
                <g key={j}>
                  <Arrow
                    x0={zero + a.from * unit}
                    x1={zero + a.to * unit}
                    y={y + a.dy}
                    color={a.color}
                    dashed={a.dashed}
                  />
                  {a.name && (
                    <text
                      x={
                        a.nameAt === "start"
                          ? zero + a.from * unit - 5
                          : zero + ((a.from + a.to) / 2) * unit
                      }
                      y={
                        a.nameAt === "start"
                          ? y + a.dy + 3.5
                          : a.nameAt === "above"
                            ? y + a.dy - 7
                            : y + a.dy + 15
                      }
                      textAnchor={a.nameAt === "start" ? "end" : "middle"}
                      className="font-mono"
                      fontSize={10}
                      fill={a.color}
                    >
                      {a.name}
                    </text>
                  )}
                </g>
              ))}
              <Spot x={W - spotW + 8} y={y} darkness={darkness} />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function KnownWave({
  known = "liquid",
  brief = false,
}: {
  known?: keyof typeof TEXT;
  /** Only the second panel, for a return after the first showing. */
  brief?: boolean;
}) {
  const t = TEXT[known];
  const P = PROTEIN;
  const K = KNOWN;
  return (
    <div className="flex w-full flex-col gap-6">
      {!brief && (
        <div>
          <Note title="1. Which way?">
            For these spots, symmetry allows only two offsets: in step (+) or
            half a wave out (−). Both give the same spot.
          </Note>
          <Rows
            title="The protein's wave could point either way and give the same spot."
            rows={[
              {
                label: "",
                arrows: [
                  {
                    from: 0,
                    to: P,
                    color: XR.first,
                    dy: 0,
                    dashed: true,
                    name: "+",
                  },
                  {
                    from: 0,
                    to: -P,
                    color: XR.first,
                    dy: 0,
                    dashed: true,
                    name: "−",
                  },
                ],
                darkness: P * P,
              },
            ]}
          />
        </div>
      )}
      <div>
        <Note
          title={
            brief ? `Add the ${t.name}'s wave` : `2. Add the ${t.name}'s wave`
          }
        >
          {t.add}
        </Note>
        <Rows
          title={`Adding the ${t.name}'s wave darkens the spot if the protein's points the same way, and fades it if not.`}
          rows={[
            {
              label: "if +",
              arrows: [
                {
                  from: 0,
                  to: P,
                  color: XR.first,
                  dy: -4,
                  name: "protein",
                  nameAt: "start",
                },
                {
                  from: P,
                  to: P + K,
                  color: XR.second,
                  dy: -13,
                  name: t.name,
                  nameAt: "above",
                },
                { from: 0, to: P + K, color: XR.accent, dy: 6, name: "total" },
              ],
              darkness: (P + K) ** 2,
            },
            {
              label: "if −",
              arrows: [
                { from: 0, to: -P, color: XR.first, dy: -4 },
                { from: -P, to: -P + K, color: XR.second, dy: -13 },
                { from: 0, to: -P + K, color: XR.accent, dy: 6 },
              ],
              darkness: (K - P) ** 2,
            },
          ]}
        />
      </div>
    </div>
  );
}

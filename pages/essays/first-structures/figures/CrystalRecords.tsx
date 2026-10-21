// A grid of copies turns bands into spots, and what sits in each copy sets how dark they are.
import { useEffect, useId, useState } from "react";
import { useElementWidth } from "@hooks";
import { XR } from "./palette";
import { Labels } from "./scene";
import { SpotFilm } from "./spots";
import { MOLECULE_PAIR } from "./ReadingTheFilm";
import { EDGE_TAN, bandX, filmImage, type Pt } from "./CrystalSpots";

const PER_ROW = 5;
const GLYPH_H = 30;

const centred = (i: number, n: number) => i - (n - 1) / 2;

/** `rows` upright rows of copies side by side, one repeat apart, in units of the repeat. */
function layer(rows: number): Pt[] {
  return Array.from({ length: rows * PER_ROW }, (_, n): Pt => [
    centred(Math.floor(n / PER_ROW), rows),
    centred(n % PER_ROW, PER_ROW),
  ]);
}

const ACROSS: Pt[] = Array.from({ length: PER_ROW }, (_, i): Pt => [centred(i, PER_ROW), 0]);
const ROW_FILMS: { atoms: Pt[]; label: string }[] = [
  { atoms: layer(1), label: "level bands" },
  { atoms: ACROSS, label: "upright bands" },
  { atoms: layer(PER_ROW), label: "spots" },
];

/** One band's curve across a flat film, as a path in a film `F` across at (fx, fy); `upright` swaps the axes. */
function bandPath(m: number, upright: boolean, fx: number, fy: number, F: number) {
  const at = (v: number) => (v / EDGE_TAN) * (F / 2);
  let d = "";
  for (let s = -EDGE_TAN; s <= EDGE_TAN + 1e-9; s += EDGE_TAN / 30) {
    const u = bandX(m, s);
    const [x, y] = upright ? [u, s] : [s, u];
    d += `${d ? "L" : "M"}${(fx + F / 2 + at(x)).toFixed(1)} ${(fy + F / 2 + at(y)).toFixed(1)}`;
  }
  return d;
}
const ORDERS = [-2, -1, 0, 1, 2].filter((m) => Math.abs(bandX(m, 0)) < EDGE_TAN);

function Dots({ x, atoms }: { x: number; atoms: Pt[] }) {
  const pitch = GLYPH_H / PER_ROW;
  return (
    <g fill={XR.sum}>
      {atoms.map(([u, v]) => (
        <circle key={`${u}-${v}`} cx={x + u * pitch} cy={GLYPH_H / 2 + v * pitch} r={1.6} />
      ))}
    </g>
  );
}

/** Three copies of a molecule side by side, each in a box `GLYPH_H` across. */
function Molecules({ x, y, atoms }: { x: number; y: number; atoms: { x: number; y: number }[] }) {
  return (
    <g fill={XR.moleculeEdge}>
      {[-1, 0, 1].flatMap((c) =>
        atoms.map((a, k) => (
          <circle key={`${c}-${k}`} cx={x + (c - 0.5 + a.x) * GLYPH_H} cy={y + (a.y - 0.5) * GLYPH_H + GLYPH_H / 2} r={1.6} />
        )),
      )}
    </g>
  );
}

export function CrystalRecords() {
  const ids = useId();
  const [ref, W] = useElementWidth<HTMLDivElement>(320);
  const [bands, setBands] = useState<string[] | null>(null);
  useEffect(() => {
    setBands(ROW_FILMS.map((r) => filmImage(r.atoms)));
  }, []);

  const text = W < 520 ? 10 : 11;
  const S = Math.min(150, (W - 12) / 2);
  const x0 = (W - (2 * S + 12)) / 2;
  const col = (i: number) => x0 + i * (S + 12);
  const S3 = (W - 24) / 3;
  const col3 = (i: number) => i * (S3 + 12);
  const rowH = GLYPH_H + 6 + S + 22;
  const divider = GLYPH_H + 6 + S3 + 22 + 12;
  const row2 = divider + 20;
  const H = row2 + rowH + 18;
  const [a, b] = MOLECULE_PAIR.panels;

  const caption = (i: number, y: number, label: string) => (
    <Labels size={text}>
      <text x={col(i) + S / 2} y={y + GLYPH_H + 6 + S + 16} textAnchor="middle">
        {label}
      </text>
    </Labels>
  );

  return (
    <div ref={ref} className="w-full">
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="block" role="img" aria-labelledby={`${ids}t ${ids}d`}>
        <title id={`${ids}t`}>A grid of copies makes spots; what is in each copy sets how dark they are</title>
        <desc id={`${ids}d`}>
          Five films. An upright row of copies gives level bands, a row lying across gives upright bands, and a flat
          grid of both gives spots only where the two sets of bands cross. A grid of one molecule and a grid of
          another give spots in the same places, some darker and some fainter.
        </desc>

        <clipPath id={`${ids}c`}>
          <rect x={col3(2)} y={GLYPH_H + 6} width={S3} height={S3} />
        </clipPath>
        {ROW_FILMS.map(({ atoms, label }, i) => (
          <g key={label}>
            <Dots x={col3(i) + S3 / 2} atoms={atoms} />
            <rect x={col3(i)} y={GLYPH_H + 6} width={S3} height={S3} fill={XR.film} />
            {bands && <image href={bands[i]} x={col3(i)} y={GLYPH_H + 6} width={S3} height={S3} preserveAspectRatio="none" />}
            {i === 2 && (
              <g fill="none" stroke={XR.accent} strokeOpacity={0.55} strokeWidth={0.75} strokeDasharray="3 3" clipPath={`url(#${ids}c)`}>
                {ORDERS.flatMap((m) => [
                  <path key={`l${m}`} d={bandPath(m, false, col3(i), GLYPH_H + 6, S3)} />,
                  <path key={`u${m}`} d={bandPath(m, true, col3(i), GLYPH_H + 6, S3)} />,
                ])}
              </g>
            )}
            <circle cx={col3(i) + S3 / 2} cy={GLYPH_H + 6 + S3 / 2} r={Math.max(3, S3 / 30)} fill={XR.label} />
            <rect x={col3(i)} y={GLYPH_H + 6} width={S3} height={S3} fill="none" stroke={XR.atom} strokeWidth={0.75} />
            <Labels size={text}>
              <text x={col3(i) + S3 / 2} y={GLYPH_H + 6 + S3 + 16} textAnchor="middle" fill={i === 2 ? XR.accent : XR.label}>
                {label}
              </text>
            </Labels>
          </g>
        ))}

        <line x1={0} x2={W} y1={divider} y2={divider} stroke={XR.rule} />
        {[a, b].map((p, i) => (
          <g key={p.label}>
            <Molecules x={col(i) + S / 2} y={row2} atoms={p.atoms} />
            <SpotFilm
              x={col(i)}
              y={row2 + GLYPH_H + 6}
              size={S}
              spots={p.spots}
              max={p.max}
              linear
              marks={MOLECULE_PAIR.marks ? MOLECULE_PAIR.marks(i === 1) : []}
            />
          </g>
        ))}
        {caption(0, row2, "one molecule")}
        {caption(1, row2, "another molecule")}
        <Labels size={text}>
          <text x={W / 2} y={H - 4} textAnchor="middle" fill={XR.accent}>
            same places, different darkness
          </text>
        </Labels>
      </svg>
    </div>
  );
}

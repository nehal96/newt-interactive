// What a spot says about the atoms, what the film keeps of it, and how the spots add back into a picture.
import { useId } from "react";
import { useElementWidth } from "@hooks";
import { XR } from "./palette";
import { TAU, curvePath } from "./wave";
import { Labels } from "./scene";
import { Note } from "./TwoAtoms";
import { Spot, StaticHeight, Wave } from "./SpotRecords";
import { ATOMS, WavesToPicture } from "./WavesToPicture";

/** Spot `h`'s wave across the cell, placed where the atoms fit it best, and how strong the spot is out of 1. */
function spotWave(h: number) {
  let re = 0;
  let im = 0;
  for (const x of ATOMS) {
    re += Math.cos(TAU * h * x);
    im += Math.sin(TAU * h * x);
  }
  const phase = Math.atan2(im, re);
  /** Crest k sits where h·x − phase/2π is a whole number. */
  const crest = (k: number) => (k + phase / TAU) / h;
  return {
    at: (x: number) => Math.cos(TAU * h * x - phase),
    crest,
    strength: Math.hypot(re, im) / ATOMS.length,
  };
}

const FITS = [
  { h: 4, label: "a spot far from the center: all three atoms on crests", verdict: "dark", mark: "in step" },
  { h: 2, label: "a spot nearer the center: one atom in a trough", verdict: "faint", mark: "half a wave out" },
];

/** How far either side of a crest the pale band reaches, in the wave's own wavelengths. */
const BAND = 0.17;

function AtomsOnWaves({ W }: { W: number }) {
  const clip = useId();
  const spot = 30;
  const side = spot + 52;
  const cellW = W - side;
  const amp = 13;
  const rowH = 2 * amp + 58;
  const H = FITS.length * rowH;
  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      className="block"
      role="img"
      aria-label="Two spots' waves across one unit cell with the same three atoms. The finer wave has all three atoms on its crests, where they arrive in step, and its spot is dark. The coarser wave has one atom in a trough, half a wave out, and its spot is faint."
    >
      <defs>
        <clipPath id={clip}>
          <rect x={0} y={0} width={cellW} height={H} />
        </clipPath>
      </defs>
      {FITS.map(({ h, label, verdict, mark }, i) => {
        const { at, crest, strength } = spotWave(h);
        const top = i * rowH;
        const cy = top + 34 + amp;
        const crests = Array.from({ length: h + 2 }, (_, k) => crest(k - 1)).filter((c) => c > -0.2 && c < 1.2);
        // The top row labels its middle atom, which sits on a crest; the bottom row its lowest, in the trough.
        const lowest = ATOMS.reduce((m, a) => (at(a) < at(m) ? a : m));
        const marked = i === 0 ? ATOMS[1] : lowest;
        const markY = i === 0 ? cy - amp * at(marked) - 11 : cy - amp * at(marked) + 19;
        return (
          <g key={h}>
            <Labels size={10}>
              <text x={0} y={top + 10}>{label}</text>
            </Labels>
            <g clipPath={`url(#${clip})`} fill={XR.first} fillOpacity={0.09}>
              {crests.map((c) => (
                <rect key={c} x={(c - BAND / h) * cellW} y={cy - amp - 6} width={((2 * BAND) / h) * cellW} height={2 * amp + 12} />
              ))}
            </g>
            <g stroke={XR.label} strokeWidth={1}>
              <line x1={0} x2={0} y1={cy - amp - 6} y2={cy + amp + 6} />
              <line x1={cellW} x2={cellW} y1={cy - amp - 6} y2={cy + amp + 6} />
            </g>
            <line x1={0} x2={cellW} y1={cy} y2={cy} stroke={XR.rule} />
            <path d={curvePath(0, cy, cellW, (t) => amp * at(t / cellW), 1)} fill="none" stroke={XR.first} strokeWidth={2} />
            <g fill={XR.sum}>
              {ATOMS.map((a) => (
                <circle key={a} cx={a * cellW} cy={cy - amp * at(a)} r={4.5} />
              ))}
            </g>
            <Labels size={10}>
              <text x={marked * cellW} y={markY} textAnchor="middle" fill={i === 0 ? XR.first : XR.label}>
                {mark}
              </text>
            </Labels>
            <rect x={W - side + 14} y={cy - spot / 2} width={spot} height={spot} fill={XR.film} stroke={XR.atom} strokeWidth={0.75} />
            <circle cx={W - side + 14 + spot / 2} cy={cy} r={spot * 0.2} fill={XR.sum} fillOpacity={strength ** 2} />
            <Labels size={10}>
              <text x={W - side + 14 + spot + 6} y={cy + 4}>{verdict}</text>
            </Labels>
          </g>
        );
      })}
    </svg>
  );
}

const CASES = [
  { label: "a wave", height: 0.8, shift: 0 },
  { label: "crests shifted", height: 0.8, shift: 0.25 },
  { label: "twice as tall", height: 1.6, shift: 0 },
];

/** The three cases side by side, each wave beside the spot it makes. */
function HeightStrip({ W }: { W: number }) {
  const gap = 20;
  const colW = (W - 2 * gap) / 3;
  const spot = 30;
  const amp = 9;
  const cy = 44;
  const H = cy + amp * 1.6 + 8;
  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      className="block"
      role="img"
      aria-label="A wave and its spot; the same wave with its crests shifted gives the same spot; a wave twice as tall gives a darker spot."
    >
      {CASES.map((c, i) => {
        const x = i * (colW + gap);
        return (
          <g key={c.label}>
            <text x={x} y={12} className="font-mono" fontSize={10} fill={XR.label}>
              {c.label}
            </text>
            <Wave x={x} cy={cy} w={colW - spot - 12} amp={amp} height={c.height} shift={c.shift} crest />
            <Spot x={x + colW - spot} y={cy - spot / 2} size={spot} height={c.height} />
          </g>
        );
      })}
    </svg>
  );
}

const Rule = () => <hr className="my-7 border-ink-200" />;

export function PhaseProblem() {
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  return (
    <div ref={ref} className="w-full">
      <Note title="1. What a spot says about the atoms">
        Pick one spot and slide an atom across the unit cell. Its path to that spot grows as it
        goes, and each time the path has grown by a whole wave, the atom is back in step. Those
        places are the crests of the spot&rsquo;s wave, and halfway between them the atom arrives half
        a wave out. So a spot is dark when the atoms sit on its crests, and faint when some sit in
        its troughs. Spots farther from the center have finer waves.
      </Note>
      <div className="mt-3">
        <AtomsOnWaves W={W} />
      </div>

      <Rule />

      <Note title="2. The film keeps only the height">
        A spot is darker the taller its wave. Shift the wave&rsquo;s crests, and the spot stays the
        same, so the film has no record of where they fell.
      </Note>
      <div className="mt-3">{W >= 520 ? <HeightStrip W={W} /> : <StaticHeight w={W} />}</div>

      <Rule />

      <Note title="3. Adding the waves back">
        To get the picture, run it backwards. Draw each spot&rsquo;s wave as tall as the spot is dark,
        with its crests in the right places, and add them all up. The crests pile up where the atoms
        are. Keep the same heights but move some crests, and the peaks land somewhere else.
      </Note>
      <div className="mt-3">
        <WavesToPicture />
      </div>
    </div>
  );
}

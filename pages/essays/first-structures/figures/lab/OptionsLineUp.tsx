// Options board for idea 2: rough static sketches of an interactive line-up and a step-by-step strip, side by side.
import { useId, type ReactNode } from "react";
import { useElementWidth } from "@hooks";
import { XR } from "../palette";
import { curvePath } from "../wave";
import { Profile } from "./stripes";
import { ATOMS, HEIGHT, PEAK, RIGHT, SPOTS, START, TALLEST, sumOf, wave } from "./LineUp";

const shade = (h: number) => 0.08 + (0.88 * h * h) / (TALLEST * TALLEST);

function Film({ w }: { w: number }) {
  return (
    <svg width={w} height={22} viewBox={`0 0 ${w} 22`} className="block" aria-hidden>
      <rect x={0.5} y={1} width={w - 1} height={20} fill={XR.film} stroke={XR.atom} strokeWidth={0.75} />
      {SPOTS.map((n, i) => (
        <circle key={n} cx={((i + 1) / (SPOTS.length + 1)) * w} cy={11} r={5} fill={XR.sum} fillOpacity={shade(HEIGHT[i])} />
      ))}
    </svg>
  );
}

function Waves({ w, signs, both = false, pills = false }: { w: number; signs: number[]; both?: boolean; pills?: boolean }) {
  const rowH = 24;
  const x0 = pills ? 40 : 0;
  const len = w - x0;
  const amp = 9;
  return (
    <svg width={w} height={rowH * SPOTS.length} viewBox={`0 0 ${w} ${rowH * SPOTS.length}`} className="block" aria-hidden>
      <line x1={x0 + len / 2} x2={x0 + len / 2} y1={0} y2={rowH * SPOTS.length} stroke={XR.atom} strokeDasharray="2 3" />
      {SPOTS.map((n, i) => {
        const y = i * rowH + rowH / 2;
        const f = (sign: number) => (t: number) => (amp * wave(i, sign)(t / len)) / TALLEST;
        return (
          <g key={n}>
            {pills && (
              <g>
                <rect x={0} y={y - 8} width={32} height={16} rx={5} fill={XR.film} stroke={XR.atom} />
                <text x={16} y={y + 4} textAnchor="middle" className="font-mono" fontSize={10} fill={XR.label}>
                  ⇅
                </text>
              </g>
            )}
            <line x1={x0} x2={w} y1={y} y2={y} stroke={XR.rule} />
            {both ? (
              <>
                <path d={curvePath(x0, y, len, f(1), 1)} fill="none" stroke={XR.first} strokeWidth={1.25} strokeDasharray="3 2" strokeOpacity={0.7} />
                <path d={curvePath(x0, y, len, f(-1), 1)} fill="none" stroke={XR.first} strokeWidth={1.25} strokeDasharray="3 2" strokeOpacity={0.7} />
              </>
            ) : (
              <path d={curvePath(x0, y, len, f(signs[i]), 1)} fill="none" stroke={XR.first} strokeWidth={1.5} />
            )}
          </g>
        );
      })}
    </svg>
  );
}

function Picture({ w, signs, atoms, wrong = false }: { w: number; signs: number[]; atoms: boolean; wrong?: boolean }) {
  const uid = useId().replace(/:/g, "");
  const amp = 26;
  const sum = sumOf(signs);
  const mapY = 2 * amp + 8;
  const atomsY = mapY + 18;
  const H = atomsY + 18;
  return (
    <svg width={w} height={H} viewBox={`0 0 ${w} ${H}`} className="block" aria-hidden>
      <defs>
        <Profile id={uid} x0={0} x1={w} colour={XR.sum} alpha={(x) => (0.85 * Math.max(0, sum(x))) / PEAK} />
      </defs>
      {atoms &&
        ATOMS.map((x) => <line key={x} x1={x * w} x2={x * w} y1={0} y2={atomsY + 8} stroke={XR.label} strokeWidth={0.75} strokeDasharray="2 3" />)}
      <line x1={0} x2={w} y1={amp + 2} y2={amp + 2} stroke={XR.rule} />
      <path d={curvePath(0, amp + 2, w, (t) => (amp * sum(t / w)) / PEAK, 1)} fill="none" stroke={wrong ? XR.accent : XR.sum} strokeWidth={2} />
      <rect x={0.5} y={mapY} width={w - 1} height={12} fill={`url(#${uid})`} stroke={XR.atom} strokeWidth={0.75} />
      <rect x={0.5} y={atomsY} width={w - 1} height={16} fill="none" stroke={XR.atom} strokeWidth={0.75} strokeDasharray="3 3" />
      {atoms ? (
        ATOMS.map((x) => <circle key={x} cx={x * w} cy={atomsY + 8} r={3.5} fill={XR.sum} />)
      ) : (
        <text x={w / 2} y={atomsY + 12} textAnchor="middle" className="font-mono" fontSize={10} fill={XR.label}>
          ?
        </text>
      )}
    </svg>
  );
}

function Step({ n, children, figure }: { n: number; children: ReactNode; figure: ReactNode }) {
  return (
    <div className="mb-4">
      <p className="mb-1.5 font-ui text-xs leading-[1.125rem] text-ink-700">
        <span className="mr-1.5 font-mono text-ink-400">{n}</span>
        {children}
      </p>
      {figure}
    </div>
  );
}

const Mono = ({ children, red = false }: { children: ReactNode; red?: boolean }) => (
  <p className={`font-mono text-[10px] leading-4 ${red ? "text-rose-600" : "text-ink-500"}`}>{children}</p>
);

function Option({ letter, title, test, children }: { letter: string; title: string; test: string; children: ReactNode }) {
  return (
    <div className="min-w-0 flex-1">
      <p className="font-ui text-sm font-semibold text-ink-900">
        {letter}. {title}
      </p>
      <p className="mb-3 font-ui text-xs text-ink-500">First look: {test}</p>
      {children}
    </div>
  );
}

export function OptionsLineUp() {
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const stacked = W < 560;
  const gap = 32;
  const w = Math.floor(stacked ? W : (W - gap) / 2);

  return (
    <div ref={ref} className={`flex w-full ${stacked ? "flex-col gap-10" : "flex-row"}`} style={{ gap: stacked ? undefined : gap }}>
      <Option letter="A" title="Interactive: line up the waves" test="“every line-up draws a molecule, and the film fits all of them.”">
        <Mono>the film</Mono>
        <Film w={w} />
        <Mono red>the film never changes</Mono>
        <div className="mt-3">
          <Mono>each spot’s wave: tap ⇅ to flip it</Mono>
          <Waves w={w} signs={START} pills />
        </div>
        <div className="mt-3">
          <Mono>the picture they add up to, and as a map</Mono>
          <Picture w={w} signs={START} atoms={false} />
        </div>
        <div className="mt-2 flex items-center justify-between">
          <Mono>the real atoms: hidden</Mono>
          <span className="rounded border border-ink-300 px-1.5 py-0.5 font-ui text-[10px] text-ink-600">Show them</span>
        </div>
        <p className="mt-3 font-ui text-xs text-ink-700">Pictures you’ve made: 3 of 16. The film fits every one. Which is the molecule?</p>
        <p className="mt-3 font-ui text-xs text-ink-500">
          Continues into idea 3: the same figure gains an “Add a heavy atom” step. Cost: one control per wave, and the reader has
          to play to get it.
        </p>
      </Option>

      <Option letter="B" title="Step by step, static" test="“lined up one way, the molecule; another way, a different one; same film.”">
        <Step n={1} figure={<Film w={w} />}>
          The film: four spots.
        </Step>
        <Step n={2} figure={<Waves w={w} signs={RIGHT} both />}>
          Each spot is a wave, as strong as the spot is dark. Crest or trough at the middle? The film doesn’t say.
        </Step>
        <Step n={3} figure={<Picture w={w} signs={RIGHT} atoms />}>
          Lined up one way, the waves add into the molecule: a peak on each atom.
        </Step>
        <Step n={4} figure={<Picture w={w} signs={START} atoms wrong />}>
          Lined up another way, they draw a different molecule, from the very same film.
        </Step>
        <p className="font-ui text-xs text-ink-500">
          Continues into idea 3 as a fifth panel: add a heavy atom, and each spot’s change picks the right line-up. Cost: no
          play; reads in one pass, but tells rather than lets the reader find it.
        </p>
      </Option>
    </div>
  );
}

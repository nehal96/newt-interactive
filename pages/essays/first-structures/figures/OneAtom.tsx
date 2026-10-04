// Figure 2: one atom in an X-ray beam, and the film it exposes.
import { useId } from "react";
import { useElementWidth } from "@hooks";
import { XR } from "./palette";
import { filmGradient, type BeamStop, type Pt } from "./scatter";
import { Atom, BeamArrow, BeamKey, Film, Labels, Ripples, StopBlock } from "./scene";

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

export default function OneAtom() {
  const ids = useId();
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const narrow = W < 520;
  const H = Math.round(clamp(W * 0.5, 230, 330));
  const lambda = clamp(W / 14, 24, 48);
  const text = narrow ? 11 : 12;

  const atom: Pt = [Math.round(W * 0.3), Math.round(H * 0.55)];
  const [ax, ay] = atom;
  const filmW = narrow ? 16 : 22;
  const filmX = W - filmW - 2;
  const filmTop = 26;
  const filmBottom = H - 6;
  const stop: BeamStop = { x: filmX - (narrow ? 14 : 20), y: ay, half: lambda * 0.3 + 5 };
  const stops = filmGradient([atom], lambda, filmX, filmTop, filmBottom, stop, 2);

  return (
    <div ref={ref} className="w-full">
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        className="block"
        role="img"
        aria-labelledby={`${ids}t ${ids}d`}
      >
        <title id={`${ids}t`}>
          One atom sends a faint ripple in every direction.
        </title>
        <desc id={`${ids}d`}>
          An arrow shows an X-ray beam travelling from left to right to a single
          atom; a key notes that the arrow, a wave and its crests drawn as lines
          all stand for the same beam. A small block stops the beam in front of
          the film. Circular crests spread
          from the atom in every direction, fading as they spread. The film
          shows only a faint, smooth fog, clear where the block shades it.
        </desc>
        <defs>
          <clipPath id={`${ids}c`}>
            <rect x={0} y={0} width={filmX} height={H} />
          </clipPath>
        </defs>

        <Ripples cx={ax} cy={ay} lambda={lambda} reach={filmX - ax + lambda} clipId={`${ids}c`} />
        <BeamArrow x0={Math.max(4, ax - 4 * lambda)} x1={ax - 0.8 * lambda} y={ay} />
        <BeamKey x={4} y={16} size={text} />
        <StopBlock stop={stop} />
        <Film
          x={filmX}
          top={filmTop}
          bottom={filmBottom}
          width={filmW}
          gradientId={`${ids}g`}
          stops={stops}
        />
        <Atom x={ax} y={ay} />

        <Labels size={text}>
          <text x={Math.max(4, ax - 4 * lambda)} y={ay - 10}>X-rays</text>
          <text x={ax} y={ay + lambda * 0.5 + 16} textAnchor="middle" fill={XR.sum}>
            one atom
          </text>
          <text x={stop.x + 6} y={ay + stop.half + 16} textAnchor="end">
            beam stop
          </text>
          <text x={filmX - 8} y={filmTop + 12} textAnchor="end">
            film: a faint fog
          </text>
        </Labels>
      </svg>
    </div>
  );
}

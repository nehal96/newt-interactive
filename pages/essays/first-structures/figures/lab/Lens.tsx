// A lens brings scattered light back together into a picture; nothing does that for x-rays, so they land as separate spots.
import { useId } from "react";
import { useElementWidth } from "@hooks";
import { XR } from "../palette";
import { BeamArrow, Labels } from "../scene";

const RAYS = [-1, -0.33, 0.33, 1];

export function Lens() {
  const ids = useId();
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const narrow = W < 520;
  const text = narrow ? 10 : 11;
  const head = narrow ? 11 : 12;

  const panelH = narrow ? 150 : 170;
  const top = [22, 22 + panelH + 40];
  const H = top[1] + panelH + 26;

  const objX = narrow ? 70 : 100;
  const lensX = W * 0.5;
  const imgX = W - (narrow ? 34 : 60);
  const half = panelH * 0.38;
  const points = [-0.45, 0.4];
  const colour = [XR.first, XR.second];

  const mid = (k: number) => top[k] + panelH / 2;
  const filmX = imgX;
  const spots = [-0.9, -0.62, -0.34, 0.34, 0.62, 0.9];

  return (
    <div ref={ref} className="w-full">
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="block" role="img" aria-labelledby={`${ids}t ${ids}d`}>
        <title id={`${ids}t`}>A lens brings scattered light back together into a picture; x-rays have no lens, so they land as spots</title>
        <desc id={`${ids}d`}>
          Above, light scattered from two points on an object spreads out, passes through a lens and comes back together,
          each point's waves meeting again at one point of the picture. Below, x-rays scattered by a crystal spread out
          the same way, but with no lens they fly apart and land on the film as separate spots.
        </desc>

        <BeamArrow x0={4} x1={objX - 10} y={mid(0)} />
        <line x1={objX} x2={objX} y1={mid(0) - half * 0.7} y2={mid(0) + half * 0.7} stroke={XR.atom} strokeWidth={1} />
        {points.map((p, i) => {
          const oy = mid(0) + p * half;
          const iy = mid(0) - p * half;
          return (
            <g key={p} stroke={colour[i]} strokeWidth={1.25} strokeOpacity={0.75} fill="none">
              {RAYS.map((r) => {
                const ly = mid(0) + r * half * 0.95;
                return <path key={r} d={`M${objX} ${oy} L${lensX} ${ly} L${imgX} ${iy}`} />;
              })}
            </g>
          );
        })}
        <ellipse cx={lensX} cy={mid(0)} rx={7} ry={half * 1.05} fill={XR.molecule} fillOpacity={0.5} stroke={XR.moleculeEdge} />
        <line x1={imgX + 4} x2={imgX + 4} y1={mid(0) - half * 1.05} y2={mid(0) + half * 1.05} stroke={XR.atom} strokeWidth={3} />
        {points.map((p, i) => (
          <g key={p}>
            <circle cx={objX} cy={mid(0) + p * half} r={4.5} fill={colour[i]} />
            <circle cx={imgX + 4} cy={mid(0) - p * half} r={5} fill={colour[i]} />
          </g>
        ))}

        <BeamArrow x0={4} x1={objX - 14} y={mid(1)} />
        <rect x={objX - 8} y={mid(1) - 8} width={16} height={16} fill={XR.molecule} stroke={XR.moleculeEdge} />
        <g stroke={XR.first} strokeWidth={1.25} strokeOpacity={0.75}>
          {spots.map((s) => (
            <line key={s} x1={objX + 8} y1={mid(1)} x2={filmX} y2={mid(1) + s * half * 1.05} />
          ))}
        </g>
        <line x1={objX + 8} x2={filmX - 12} y1={mid(1)} y2={mid(1)} stroke={XR.first} strokeOpacity={0.3} strokeWidth={1.5} />
        <rect x={filmX - 12} y={mid(1) - 5} width={5} height={10} rx={1} fill={XR.label} />
        <rect x={filmX} y={mid(1) - half * 1.2} width={7} height={half * 2.4} fill={XR.film} stroke={XR.atom} strokeWidth={0.75} />
        {spots.map((s) => (
          <circle key={s} cx={filmX + 3.5} cy={mid(1) + s * half * 1.05} r={3.5} fill={XR.sum} />
        ))}

        {[0, 1].map((k) => (
          <text key={k} x={0} y={top[k] - 8} className="font-ui" fontSize={head} fontWeight={600} fill={XR.sum}>
            {k ? "X-rays: no lens, so each wave lands on its own" : "Light: a lens brings the waves back together"}
          </text>
        ))}
        <Labels size={text}>
          <text x={objX} y={mid(0) + half + 18} textAnchor="middle">object</text>
          <text x={lensX} y={mid(0) + half * 1.05 + 16} textAnchor="middle">lens</text>
          <text x={imgX + 4} y={mid(0) + half * 1.05 + 16} textAnchor="middle">picture</text>
          <text x={objX} y={mid(1) + 26} textAnchor="middle">crystal</text>
          <text x={filmX + 3.5} y={mid(1) + half * 1.2 + 16} textAnchor="middle">spots</text>
        </Labels>
      </svg>
    </div>
  );
}

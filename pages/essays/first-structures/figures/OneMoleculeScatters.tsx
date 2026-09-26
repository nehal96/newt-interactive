import { XR } from "./palette";
import Molecule from "./Molecule";

const C = { x: 320, y: 125 };
const WAVEFRONTS = [40, 60, 80, 100, 120];
const RINGS = [
  { r: 45, opacity: 0.75 },
  { r: 70, opacity: 0.55 },
  { r: 95, opacity: 0.4 },
  { r: 120, opacity: 0.25 },
];

export default function OneMoleculeScatters() {
  return (
    <figure className="mx-auto my-8 w-full max-w-[38rem] lg:my-12">
      <svg
        viewBox="0 0 680 250"
        className="h-auto w-full"
        role="img"
        aria-label="An x-ray wave reaches one molecule, which sends scattered waves out in every direction"
      >
        <g stroke={XR.first} strokeWidth={1.5}>
          {WAVEFRONTS.map((x) => (
            <line key={x} x1={x} y1={92} x2={x} y2={158} />
          ))}
        </g>
        <line
          x1={130}
          y1={C.y}
          x2={238}
          y2={C.y}
          stroke={XR.first}
          strokeWidth={2.5}
        />
        <polygon
          points={`238,${C.y - 6} 250,${C.y} 238,${C.y + 6}`}
          fill={XR.first}
        />

        {RINGS.map(({ r, opacity }) => (
          <circle
            key={r}
            cx={C.x}
            cy={C.y}
            r={r}
            fill="none"
            stroke={XR.first}
            strokeWidth={1.2}
            strokeOpacity={opacity}
          />
        ))}
        <line
          x1={356}
          y1={C.y}
          x2={455}
          y2={C.y}
          stroke={XR.first}
          strokeWidth={1.5}
          strokeDasharray="5 4"
          strokeOpacity={0.5}
        />
        <Molecule x={C.x} y={C.y} />

        <g className="font-mono" fontSize={12} fill={XR.label}>
          <text x={80} y={80} textAnchor="middle">
            x-rays
          </text>
          <text x={C.x} y={186} textAnchor="middle">
            one molecule
          </text>
          <text x={470} y={100}>
            scattered waves spread
          </text>
          <text x={470} y={116}>
            out in every direction
          </text>
          <text x={470} y={150}>
            one molecule scatters far
          </text>
          <text x={470} y={166}>
            too little to record
          </text>
        </g>
      </svg>
    </figure>
  );
}

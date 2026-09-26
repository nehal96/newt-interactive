import { XR } from "./palette";
import Molecule from "./Molecule";

const CANCELLED = [
  [252.5, 102.4],
  [215.4, 95.8],
  [186.1, 111.1],
  [173.3, 131.2],
  [173.3, 168.8],
  [189.6, 192.1],
  [215.4, 204.2],
  [252.5, 197.6],
];
const RAYS = [
  [482.5, 47.5],
  [482.5, 77.5],
  [482.5, 107.5],
  [482.5, 137.5],
  [482.5, 167.5],
  [482.5, 197.5],
  [507.5, 82.5],
];
const DARKNESS: (number | null)[][] = [
  [0.7, 0.9, 0.7, 0.7, 0.9, 0.9, 0.3],
  [0.3, 0.9, 0.7, 0.9, 0.3, 0.15, 0.7],
  [0.5, 0.3, 0.15, null, 0.9, 0.15, 0.9],
  [0.7, 0.7, 0.9, null, 0.3, 0.9, 0.15],
  [0.9, 0.15, 0.15, 0.15, 0.3, 0.3, 0.9],
  [0.15, 0.7, 0.5, 0.7, 0.9, 0.3, 0.9],
];
const SPOTS = DARKNESS.flatMap((col, i) =>
  col.flatMap((o, j) =>
    o === null ? [] : [{ x: 482.5 + 25 * i, y: 47.5 + 5 * i + 30 * j, o }],
  ),
);
const LATTICE = [200, 220, 240].flatMap((x) =>
  [130, 150, 170].map((y) => [x, y]),
);

export default function CrystalToFilm() {
  return (
    <figure className="mx-auto my-8 w-full max-w-[40rem] lg:my-12 lg:max-w-[48rem]">
      <svg
        viewBox="0 20 680 260"
        className="h-auto w-full"
        role="img"
        aria-label="X-rays enter a crystal; in most directions the scattered waves cancel, in a few they add into bright rays that make spots on a film"
      >
        <line
          x1={20}
          y1={150}
          x2={178}
          y2={150}
          stroke={XR.first}
          strokeWidth={3}
        />
        <polygon points="178,144 190,150 178,156" fill={XR.first} />

        <g stroke={XR.label} strokeDasharray="3 3" strokeOpacity={0.5}>
          {CANCELLED.map(([x, y]) => (
            <line key={`${x}-${y}`} x1={225} y1={150} x2={x} y2={y} />
          ))}
        </g>
        <line
          x1={272}
          y1={150}
          x2={528}
          y2={150}
          stroke={XR.first}
          strokeWidth={2}
          strokeDasharray="6 4"
          strokeOpacity={0.5}
        />
        <rect x={528} y={143} width={8} height={14} fill={XR.label} />

        <polygon
          points="470,30 620,60 620,270 470,240"
          fill={XR.rule}
          fillOpacity={0.6}
          stroke={XR.atom}
        />
        <g stroke={XR.sum} strokeWidth={1.2} strokeOpacity={0.5}>
          {RAYS.map(([x, y]) => (
            <line key={`${x}-${y}`} x1={262} y1={152} x2={x} y2={y} />
          ))}
        </g>
        <g fill={XR.sum}>
          {SPOTS.map(({ x, y, o }) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r={4.5} fillOpacity={o} />
          ))}
        </g>

        <g fill={XR.molecule} stroke={XR.moleculeEdge}>
          <polygon points="250,120 270,124 270,184 250,180" fillOpacity={0.7} />
          <polygon points="190,180 250,180 270,184 210,184" fillOpacity={0.7} />
          <rect x={190} y={120} width={60} height={60} />
        </g>
        {LATTICE.map(([x, y]) => (
          <Molecule
            key={`${x}-${y}`}
            x={x}
            y={y}
            scale={0.25}
            strokeWidth={0.5}
          />
        ))}

        <g className="font-mono" fontSize={12} fill={XR.label}>
          <text x={20} y={138}>
            x-rays
          </text>
          <text x={225} y={204} textAnchor="middle">
            crystal
          </text>
          <text x={628} y={168}>
            film
          </text>
        </g>
      </svg>
    </figure>
  );
}

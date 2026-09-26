import { XR } from "./palette";

// Neighbouring centres sit just over 2 × ATOM_R apart: atoms touch, never overlap.
const ATOMS: [number, number][] = [
  [-10.3, -10.7],
  [4.1, -10.7],
  [-17.5, 1.8],
  [-3.1, 1.8],
  [11.3, 1.8],
  [25.7, 1.8],
  [-10.3, 14.3],
];
const ATOM_R = 7;

export default function Molecule({
  x,
  y,
  scale = 1,
  rotate = 0,
  strokeWidth = 1,
}: {
  x: number;
  y: number;
  scale?: number;
  rotate?: number;
  strokeWidth?: number;
}) {
  return (
    <g
      transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rotate}) scale(${scale})`}
      fill={XR.molecule}
      stroke={XR.moleculeEdge}
      strokeWidth={strokeWidth}
    >
      {ATOMS.map(([ax, ay]) => (
        <circle
          key={`${ax}-${ay}`}
          cx={ax}
          cy={ay}
          r={ATOM_R}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </g>
  );
}

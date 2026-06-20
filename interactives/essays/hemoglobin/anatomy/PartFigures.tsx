// Label-free "part icon" figures for the components parts-manifest. Each is a
// small flat ball-and-stick schematic built from the shared <AtomSphere> +
// <Bond> primitives — the same visual language as the annotated build-up beats,
// stripped of labels/leaders so the manifest can sit a "name + ×N" header over
// each. Heme and porphyrin are intentionally absent: they're *assemblies* of
// these parts (illustrated in the build-up), not raw components.
import AtomSphere from "./AtomSphere";
import Bond from "./Bond";
import { HB } from "../palette";

type FigureProps = { className?: string };

// Shared <svg> attributes — the figures are decorative (the manifest cell
// carries the text label), so they're aria-hidden rather than role="img".
const svg = (viewBox: string, className?: string) => ({
  viewBox,
  width: "100%",
  height: "100%",
  preserveAspectRatio: "xMidYMid meet" as const,
  "aria-hidden": true,
  className,
});

// A single ferrous iron ion.
export function IronFigure({ className }: FigureProps) {
  return (
    <svg {...svg("0 0 80 80", className)}>
      <AtomSphere cx={40} cy={40} r={24} element="Fe" />
    </svg>
  );
}

// Pyrrole ring: one nitrogen (pointing left, toward where the iron sits) and
// four carbons.
export function PyrroleFigure({ className }: FigureProps) {
  const N = { x: 14, y: 40 };
  const C1 = { x: 31.97, y: 15.27 };
  const C2 = { x: 61.03, y: 24.72 };
  const C3 = { x: 61.03, y: 55.28 };
  const C4 = { x: 31.97, y: 64.73 };
  return (
    <svg {...svg("0 0 76 80", className)}>
      <Bond x1={N.x} y1={N.y} x2={C1.x} y2={C1.y} width={6} />
      <Bond x1={C1.x} y1={C1.y} x2={C2.x} y2={C2.y} width={6} />
      <Bond x1={C2.x} y1={C2.y} x2={C3.x} y2={C3.y} width={6} />
      <Bond x1={C3.x} y1={C3.y} x2={C4.x} y2={C4.y} width={6} />
      <Bond x1={C4.x} y1={C4.y} x2={N.x} y2={N.y} width={6} />
      <AtomSphere cx={N.x} cy={N.y} r={10} element="N" />
      <AtomSphere cx={C1.x} cy={C1.y} r={10} element="C" />
      <AtomSphere cx={C2.x} cy={C2.y} r={10} element="C" />
      <AtomSphere cx={C3.x} cy={C3.y} r={10} element="C" />
      <AtomSphere cx={C4.x} cy={C4.y} r={10} element="C" />
    </svg>
  );
}

// A single methine (meso) carbon — the =CH– bridge that links two pyrroles. The
// two outer carbons (faded) are the neighbouring pyrroles' alpha carbons it
// joins.
export function MethineFigure({ className }: FigureProps) {
  const C = { x: 40, y: 44 };
  const ghostL = { x: 18, y: 30 };
  const ghostR = { x: 62, y: 30 };
  const H = { x: 40, y: 22 };
  return (
    <svg {...svg("0 0 80 72", className)}>
      <Bond x1={C.x} y1={C.y} x2={ghostL.x} y2={ghostL.y} width={6} />
      <Bond x1={C.x} y1={C.y} x2={ghostR.x} y2={ghostR.y} width={6} />
      <Bond x1={C.x} y1={C.y} x2={H.x} y2={H.y} width={4} />
      <g opacity={0.5}>
        <AtomSphere cx={ghostL.x} cy={ghostL.y} r={8} element="C" />
        <AtomSphere cx={ghostR.x} cy={ghostR.y} r={8} element="C" />
      </g>
      <AtomSphere cx={H.x} cy={H.y} r={6} element="H" />
      <AtomSphere cx={C.x} cy={C.y} r={10} element="C" />
    </svg>
  );
}

// Molecular oxygen — two oxygens, double bond. Atom radius (10) and viewBox
// height (80) match the pyrrole/methine carbons & nitrogens so oxygen doesn't
// read larger than the other parts in the manifest grid.
export function OxygenFigure({ className }: FigureProps) {
  const O1 = { x: 27, y: 40 };
  const O2 = { x: 53, y: 40 };
  return (
    <svg {...svg("0 0 80 80", className)}>
      <Bond x1={O1.x} y1={37} x2={O2.x} y2={37} width={3} />
      <Bond x1={O1.x} y1={43} x2={O2.x} y2={43} width={3} />
      <AtomSphere cx={O1.x} cy={O1.y} r={10} element="O" />
      <AtomSphere cx={O2.x} cy={O2.y} r={10} element="O" />
    </svg>
  );
}

// A histidine residue: the imidazole side chain (its signature N–C–N at the top,
// two ring nitrogens flanking one carbon) on its Cβ–Cα link, with a short
// backbone stub (amino N + carbonyl C=O) so it reads as a residue. The same
// figure serves both the proximal and distal histidines — they're the same
// amino acid; only their role differs.
export function HistidineFigure({ className }: FigureProps) {
  const Cg = { x: 48, y: 60 }; // Cγ — ring carbon bearing the side chain
  const Nd1 = { x: 30.88, y: 47.56 };
  const Ce1 = { x: 37.42, y: 27.44 };
  const Ne2 = { x: 58.58, y: 27.44 };
  const Cd2 = { x: 65.12, y: 47.56 };
  const Cb = { x: 48, y: 78 }; // Cβ
  const Ca = { x: 44, y: 96 }; // Cα
  const Nbb = { x: 28, y: 102 }; // backbone amino nitrogen
  const Cc = { x: 60, y: 104 }; // carbonyl carbon
  const Oc = { x: 74, y: 98 }; // carbonyl oxygen
  return (
    <svg {...svg("0 0 100 122", className)}>
      <Bond x1={Cg.x} y1={Cg.y} x2={Nd1.x} y2={Nd1.y} width={5} />
      <Bond x1={Nd1.x} y1={Nd1.y} x2={Ce1.x} y2={Ce1.y} width={5} />
      <Bond x1={Ce1.x} y1={Ce1.y} x2={Ne2.x} y2={Ne2.y} width={5} />
      <Bond x1={Ne2.x} y1={Ne2.y} x2={Cd2.x} y2={Cd2.y} width={5} />
      <Bond x1={Cd2.x} y1={Cd2.y} x2={Cg.x} y2={Cg.y} width={5} />
      <Bond x1={Cg.x} y1={Cg.y} x2={Cb.x} y2={Cb.y} width={5} />
      <Bond x1={Cb.x} y1={Cb.y} x2={Ca.x} y2={Ca.y} width={5} />
      <Bond x1={Ca.x} y1={Ca.y} x2={Nbb.x} y2={Nbb.y} width={5} />
      <Bond x1={Ca.x} y1={Ca.y} x2={Cc.x} y2={Cc.y} width={5} />
      <Bond x1={Cc.x} y1={Cc.y} x2={Oc.x} y2={Oc.y} width={5} />
      <Bond x1={Cc.x + 2} y1={Cc.y + 3} x2={Oc.x + 2} y2={Oc.y + 3} width={2.5} />
      <AtomSphere cx={Ce1.x} cy={Ce1.y} r={7.5} element="C" />
      <AtomSphere cx={Cd2.x} cy={Cd2.y} r={7.5} element="C" />
      <AtomSphere cx={Cg.x} cy={Cg.y} r={7.5} element="C" />
      <AtomSphere cx={Nd1.x} cy={Nd1.y} r={7.5} element="N" />
      <AtomSphere cx={Ne2.x} cy={Ne2.y} r={7.5} element="N" />
      <AtomSphere cx={Cb.x} cy={Cb.y} r={7.5} element="C" />
      <AtomSphere cx={Ca.x} cy={Ca.y} r={7.5} element="C" />
      <AtomSphere cx={Nbb.x} cy={Nbb.y} r={7} element="N" />
      <AtomSphere cx={Cc.x} cy={Cc.y} r={7} element="C" />
      <AtomSphere cx={Oc.x} cy={Oc.y} r={6.5} element="O" />
    </svg>
  );
}

// Per-chain blob geometry. Tuned so α and β read as two distinct molecules.
const CHAIN_SHAPE = {
  alpha: { cx: 45, cy: 54, rx: 30, ry: 41, n: 14, seed: 0.6, marks: 26 },
  beta: { cx: 46, cy: 56, rx: 33, ry: 38, n: 15, seed: 2.1, marks: 28 },
} as const;

// The lumpy silhouette: perimeter points on a wobbled ellipse, joined by arcs
// that bulge outward into a cloud-like, hand-drawn edge.
function chainBlobPath(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  n: number,
  seed: number
): string {
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
    const w =
      1 + 0.1 * Math.sin(i * 1.7 + seed) + 0.06 * Math.sin(i * 2.9 + seed * 1.3);
    pts.push({ x: cx + rx * w * Math.cos(a), y: cy + ry * w * Math.sin(a) });
  }
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p = pts[(i + 1) % n];
    const prev = pts[i];
    const r = ((Math.hypot(p.x - prev.x, p.y - prev.y) / 2) * 1.25).toFixed(1);
    d += ` A ${r} ${r} 0 0 1 ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
  }
  return `${d} Z`;
}

// Internal subunit marks: small "c"-arcs spread over the blob by a golden-angle
// phyllotaxis, each rotated a touch differently for an organic, packed feel.
function chainMarkPaths(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  count: number,
  seed: number
): string[] {
  const golden = Math.PI * (3 - Math.sqrt(5));
  const out: string[] = [];
  for (let k = 0; k < count; k++) {
    const rr = Math.sqrt((k + 0.5) / count);
    const a = k * golden + seed;
    const x = cx + Math.cos(a) * rx * rr * 0.86;
    const y = cy + Math.sin(a) * ry * rr * 0.86;
    const ar = 2 + 1.2 * (0.5 + 0.5 * Math.sin(k * 1.3 + seed));
    const rot = a + Math.PI / 3 + 0.9 * Math.sin(k * 2.1 + seed);
    const x1 = x + Math.cos(rot) * ar;
    const y1 = y + Math.sin(rot) * ar;
    const x2 = x + Math.cos(rot + 1.8) * ar;
    const y2 = y + Math.sin(rot + 1.8) * ar;
    out.push(
      `M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${ar.toFixed(1)} ${ar.toFixed(
        1
      )} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`
    );
  }
  return out;
}

// A globin chain, drawn Goodsell-style: a bumpy space-filling silhouette filled
// with a soft tint of the chain color (HB.*.light), with the saturated hue
// (HB.*.fill) carrying the outline and a scattered field of inner subunit marks.
// α = blue, β = magenta, from the shared palette. Fully deterministic
// (Math.sin / phyllotaxis), so it renders identically on server and client.
export function ChainFigure({
  variant,
  className,
}: FigureProps & { variant: "alpha" | "beta" }) {
  const swatch = variant === "alpha" ? HB.alpha : HB.beta;
  const fill = swatch.light!;
  const stroke = swatch.fill;
  const s = CHAIN_SHAPE[variant];
  const clipId = `chain-clip-${variant}`;
  const path = chainBlobPath(s.cx, s.cy, s.rx, s.ry, s.n, s.seed);
  const marks = chainMarkPaths(s.cx, s.cy, s.rx, s.ry, s.marks, s.seed);
  return (
    <svg {...svg("0 0 90 108", className)}>
      <defs>
        <clipPath id={clipId}>
          <path d={path} />
        </clipPath>
      </defs>
      <path
        d={path}
        fill={fill}
        stroke={stroke}
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
      <g
        clipPath={`url(#${clipId})`}
        fill="none"
        stroke={stroke}
        strokeWidth={1.3}
        strokeLinecap="round"
        opacity={0.55}
      >
        {marks.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
    </svg>
  );
}

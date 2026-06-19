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

// Molecular oxygen — two oxygens, double bond.
export function OxygenFigure({ className }: FigureProps) {
  const O1 = { x: 27, y: 36 };
  const O2 = { x: 53, y: 36 };
  return (
    <svg {...svg("0 0 80 72", className)}>
      <Bond x1={O1.x} y1={33} x2={O2.x} y2={33} width={3} />
      <Bond x1={O1.x} y1={39} x2={O2.x} y2={39} width={3} />
      <AtomSphere cx={O1.x} cy={O1.y} r={13} element="O" />
      <AtomSphere cx={O2.x} cy={O2.y} r={13} element="O" />
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

// Placeholder for a globin chain — a stylised helix bundle. The chains are a
// different visual register from the atomic parts (a ~140-residue fold, not a
// small molecule); this stands in until a real cartoon/ribbon is decided.
export function ChainFigure({
  variant,
  className,
}: FigureProps & { variant: "alpha" | "beta" }) {
  // From the shared chain palette: chains are colored by type — α = blue,
  // β = magenta — matching the 3D ribbons and the T<->R switch.
  const c =
    variant === "alpha"
      ? { fill: HB.alpha.fill, stroke: HB.alpha.rim! }
      : { fill: HB.beta.fill, stroke: HB.beta.rim! };
  const helix = { rx: 7, width: 14, height: 48 };
  return (
    <svg {...svg("0 0 80 92", className)}>
      <rect
        x={26}
        y={21}
        width={helix.width}
        height={helix.height}
        rx={helix.rx}
        fill={c.fill}
        stroke={c.stroke}
        strokeWidth={1.5}
        transform="rotate(-16 33 45)"
      />
      <rect
        x={40}
        y={18}
        width={helix.width}
        height={helix.height}
        rx={helix.rx}
        fill={c.fill}
        stroke={c.stroke}
        strokeWidth={1.5}
        transform="rotate(13 47 42)"
      />
      <rect
        x={33}
        y={28}
        width={helix.width}
        height={helix.height}
        rx={helix.rx}
        fill={c.fill}
        stroke={c.stroke}
        strokeWidth={1.5}
        transform="rotate(-6 40 52)"
      />
    </svg>
  );
}

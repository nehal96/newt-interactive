// Anatomy build-up, beat 3: iron + the porphyrin macrocycle. Four pyrrole rings
// arranged around the iron, each donating its nitrogen inward (a coordinate
// bond, dashed), joined at the rim by four methine (meso) bridges. Layout is
// computed from a few parameters rather than hand-placed, so the four rings stay
// symmetric. Real 3D geometry lives in the Mol* pane (iron-porphyrin.pdb).
import AtomSphere, { Element } from "./AtomSphere";
import Bond from "./Bond";

type Pt = { x: number; y: number };
const DEG = Math.PI / 180;
const seg = (p: Pt, q: Pt) => ({ x1: p.x, y1: p.y, x2: q.x, y2: q.y });
const dist = (p: Pt, q: Pt) => Math.hypot(p.x - q.x, p.y - q.y);

const FE: Pt = { x: 210, y: 200 };
const RING_DIST = 96; // Fe → pyrrole center
const RING_R = 33; // pentagon circumradius
const ATOM_R = 12;
const FE_R = 24; // ≈2× the ring atoms (covalent-radius scale)

type Ring = { center: Pt; N: Pt; Ca1: Pt; Cb1: Pt; Cb2: Pt; Ca2: Pt };
type SvgBond = { x1: number; y1: number; x2: number; y2: number; dashed?: boolean };
type SvgAtom = { p: Pt; element: Element; r: number; key: string };

function buildPorphyrin() {
  // Ring directions: top, right, bottom, left (screen degrees, y-down).
  const dirs = [270, 0, 90, 180];
  const rings: Ring[] = dirs.map((theta) => {
    const center: Pt = {
      x: FE.x + RING_DIST * Math.cos(theta * DEG),
      y: FE.y + RING_DIST * Math.sin(theta * DEG),
    };
    const phi0 = theta + 180; // N vertex points back toward Fe
    const v = (k: number): Pt => ({
      x: center.x + RING_R * Math.cos((phi0 + k) * DEG),
      y: center.y + RING_R * Math.sin((phi0 + k) * DEG),
    });
    // N at phi0; alpha carbons at ±72; beta carbons (outer) at ±144.
    return { center, N: v(0), Ca1: v(72), Cb1: v(144), Cb2: v(216), Ca2: v(288) };
  });

  const atoms: SvgAtom[] = [{ p: FE, element: "Fe", r: FE_R, key: "fe" }];
  const bonds: SvgBond[] = [];

  rings.forEach((ring, i) => {
    atoms.push({ p: ring.N, element: "N", r: ATOM_R, key: `n${i}` });
    atoms.push({ p: ring.Ca1, element: "C", r: ATOM_R, key: `a1_${i}` });
    atoms.push({ p: ring.Cb1, element: "C", r: ATOM_R, key: `b1_${i}` });
    atoms.push({ p: ring.Cb2, element: "C", r: ATOM_R, key: `b2_${i}` });
    atoms.push({ p: ring.Ca2, element: "C", r: ATOM_R, key: `a2_${i}` });
    bonds.push(seg(ring.N, ring.Ca1));
    bonds.push(seg(ring.Ca1, ring.Cb1));
    bonds.push(seg(ring.Cb1, ring.Cb2));
    bonds.push(seg(ring.Cb2, ring.Ca2));
    bonds.push(seg(ring.Ca2, ring.N));
    bonds.push({ ...seg(FE, ring.N), dashed: true }); // Fe–N coordinate bond
  });

  // Methine bridges: join each ring's outward alpha carbon to its neighbour's.
  const mesos: Pt[] = [];
  for (let i = 0; i < 4; i++) {
    const a = rings[i];
    const b = rings[(i + 1) % 4];
    const aA = [a.Ca1, a.Ca2].reduce((p, c) => (dist(c, b.center) < dist(p, b.center) ? c : p));
    const bA = [b.Ca1, b.Ca2].reduce((p, c) => (dist(c, a.center) < dist(p, a.center) ? c : p));
    const mid: Pt = { x: (aA.x + bA.x) / 2, y: (aA.y + bA.y) / 2 };
    const ang = Math.atan2(mid.y - FE.y, mid.x - FE.x);
    const meso: Pt = { x: mid.x + 5 * Math.cos(ang), y: mid.y + 5 * Math.sin(ang) };
    mesos.push(meso);
    atoms.push({ p: meso, element: "C", r: ATOM_R, key: `meso${i}` });
    bonds.push(seg(aA, meso));
    bonds.push(seg(meso, bA));
  }

  return { atoms, bonds, rings, mesos };
}

const { atoms, bonds, rings, mesos } = buildPorphyrin();

// A leader endpoint ~8px outside an atom, along the outward (from-Fe) direction.
function outward(p: Pt, gap = ATOM_R + 8): Pt {
  const a = Math.atan2(p.y - FE.y, p.x - FE.x);
  return { x: p.x + gap * Math.cos(a), y: p.y + gap * Math.sin(a) };
}

const mid = (p: Pt, q: Pt): Pt => ({ x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 });

// Label targets, derived from the computed geometry.
const T_PORPHYRIN = outward(mid(rings[0].Cb1, rings[0].Cb2), ATOM_R + 4); // top rim
const T_PYRROLE = outward(rings[3].Cb2, ATOM_R + 6); // left ring, upper-outer
const T_METHINE = outward(mesos[0], ATOM_R + 6); // upper-right bridge

const PILL = { fill: "#ffffff", stroke: "#e2e8f0" };

export default function AnnotatedPorphyrin({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 420 400"
      className={className}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-labelledby="annotated-porphyrin-title annotated-porphyrin-desc"
      fontFamily="inherit"
    >
      <title id="annotated-porphyrin-title">Iron and the porphyrin ring</title>
      <desc id="annotated-porphyrin-desc">
        Four pyrrole rings joined by methine bridges into a porphyrin macrocycle;
        each nitrogen points inward and coordinates the central iron atom.
      </desc>

      {/* Bonds (under the atoms). */}
      {bonds.map((b, i) => (
        <Bond
          key={i}
          x1={b.x1}
          y1={b.y1}
          x2={b.x2}
          y2={b.y2}
          width={b.dashed ? 5 : 9}
          dashed={b.dashed}
        />
      ))}

      {/* Atoms. */}
      {atoms.map((a) => (
        <AtomSphere key={a.key} cx={a.p.x} cy={a.p.y} r={a.r} element={a.element} />
      ))}

      {/* Labels. */}
      {/* Porphyrin (whole macrocycle) */}
      <line x1="210" y1="48" x2={T_PORPHYRIN.x} y2={T_PORPHYRIN.y} stroke="#94a3b8" strokeWidth="1.5" />
      <rect x="160" y="18" width="100" height="30" rx="15" {...PILL} strokeWidth="1" />
      <text x="210" y="38" textAnchor="middle" fontSize="15" fontWeight="500" fill="#334155">
        Porphyrin
      </text>

      {/* Pyrrole (one of the four rings) */}
      <line x1="78" y1="118" x2={T_PYRROLE.x} y2={T_PYRROLE.y} stroke="#94a3b8" strokeWidth="1.5" />
      <rect x="30" y="88" width="86" height="30" rx="15" {...PILL} strokeWidth="1" />
      <text x="73" y="108" textAnchor="middle" fontSize="15" fontWeight="500" fill="#334155">
        Pyrrole
      </text>

      {/* Methine bridge (one meso carbon) */}
      <line x1="332" y1="96" x2={T_METHINE.x} y2={T_METHINE.y} stroke="#94a3b8" strokeWidth="1.5" />
      <rect x="286" y="66" width="124" height="30" rx="15" {...PILL} strokeWidth="1" />
      <text x="348" y="86" textAnchor="middle" fontSize="15" fontWeight="500" fill="#334155">
        Methine bridge
      </text>
    </svg>
  );
}

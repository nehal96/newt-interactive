// Anatomy build-up, beat 2: iron + one pyrrole ring. A flat schematic — the
// five-membered ring (one nitrogen, four carbons) with its nitrogen donating a
// coordinate bond (dashed) to the iron. Sets up the porphyrin (four pyrroles
// around the iron) in the next beat. Real 3D geometry lives in the Mol* pane.
import AtomSphere from "./AtomSphere";
import Bond from "./Bond";

// Ring atom centers (idealized pentagon, N pointing left toward the iron).
const N = { x: 198, y: 150 };
const C_BL = { x: 234, y: 199.5 };
const C_BR = { x: 292, y: 181 };
const C_TR = { x: 292, y: 119 };
const C_TL = { x: 234, y: 101 };
const FE = { x: 100, y: 150 };

const PILL = { fill: "#ffffff", stroke: "#e2e8f0" };

export default function AnnotatedPyrrole({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 380 300"
      className={className}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-labelledby="annotated-pyrrole-title annotated-pyrrole-desc"
      fontFamily="inherit"
    >
      <title id="annotated-pyrrole-title">Iron and a pyrrole ring</title>
      <desc id="annotated-pyrrole-desc">
        A five-membered pyrrole ring (one nitrogen, four carbons); its nitrogen
        forms a coordinate bond to the central iron atom.
      </desc>

      {/* Bonds first (drawn under the atoms). */}
      <Bond x1={N.x} y1={N.y} x2={C_BL.x} y2={C_BL.y} />
      <Bond x1={C_BL.x} y1={C_BL.y} x2={C_BR.x} y2={C_BR.y} />
      <Bond x1={C_BR.x} y1={C_BR.y} x2={C_TR.x} y2={C_TR.y} />
      <Bond x1={C_TR.x} y1={C_TR.y} x2={C_TL.x} y2={C_TL.y} />
      <Bond x1={C_TL.x} y1={C_TL.y} x2={N.x} y2={N.y} />
      {/* Coordinate (dative) bond from the pyrrole N to the iron. */}
      <Bond x1={FE.x} y1={FE.y} x2={N.x} y2={N.y} width={6} dashed />

      {/* Atoms. Iron drawn at 2× the ring atoms (covalent-radius scale). */}
      <AtomSphere cx={FE.x} cy={FE.y} r={34} element="Fe" />
      <AtomSphere cx={N.x} cy={N.y} r={17} element="N" />
      <AtomSphere cx={C_BL.x} cy={C_BL.y} r={17} element="C" />
      <AtomSphere cx={C_BR.x} cy={C_BR.y} r={17} element="C" />
      <AtomSphere cx={C_TR.x} cy={C_TR.y} r={17} element="C" />
      <AtomSphere cx={C_TL.x} cy={C_TL.y} r={17} element="C" />

      {/* Labels. */}
      {/* Iron */}
      <line x1="95" y1="60" x2="99" y2="108" stroke="#94a3b8" strokeWidth="1.5" />
      <rect x="36" y="28" width="116" height="32" rx="16" {...PILL} strokeWidth="1" />
      <text x="94" y="49" textAnchor="middle" fontSize="15" fontWeight="500" fill="#334155">
        Iron (Fe²⁺)
      </text>

      {/* Pyrrole (leader to the top edge of the ring) */}
      <line x1="300" y1="60" x2="268" y2="103" stroke="#94a3b8" strokeWidth="1.5" />
      <rect x="266" y="28" width="86" height="32" rx="16" {...PILL} strokeWidth="1" />
      <text x="309" y="49" textAnchor="middle" fontSize="15" fontWeight="500" fill="#334155">
        Pyrrole
      </text>

      {/* Nitrogen */}
      <line x1="198" y1="240" x2="198" y2="175" stroke="#94a3b8" strokeWidth="1.5" />
      <rect x="150" y="240" width="96" height="32" rx="16" {...PILL} strokeWidth="1" />
      <text x="198" y="261" textAnchor="middle" fontSize="15" fontWeight="500" fill="#334155">
        Nitrogen
      </text>
    </svg>
  );
}

import dynamic from "next/dynamic";
import Lazy3DFigure, { Loading3D } from "../Lazy3DFigure";
import { HB, toHex } from "../palette";

// The Bohr salt-bridge morph: an incoming proton lands on β-His146 and its ring
// swings to clasp Asp94 — the electrostatic clasp that helps lock the tense (T)
// state and release O₂. Same baked-morph + Mol* machinery as the catching
// section (it reuses the generic MorphPlayer); only the carved structure and the
// tracked atom differ. Carbamate is the same kind of reaction at a chain N-
// terminus, so the prose nods to it rather than repeating a near-identical morph.
export const BOHR_MORPH_URL = "/structures/bohr-salt-bridge-morph.pdb";

// The incoming proton, tracked as a violet sphere over the element-colored
// pocket (His ring N blue, Asp carboxyl O red). sizeFactor 0.55 → H_vdW(1.1) ×
// 0.55 ≈ 0.6 Å, big enough to read as the hero atom without dwarfing the ring.
const PROTON_HEX = toHex(HB.acid.fill);
const PROTON_COLOR = HB.acid.fill;
const PROTON_SIZE = 0.55;

// The player owns its own WebGL engine (Mol*), so it's client-only and lazy —
// kept out of SSR / the initial bundle and only mounted once it nears the screen.
const MorphPlayer = dynamic(() => import("../catching/MorphPlayer"), {
  ssr: false,
  loading: () => <Loading3D />,
});

export default function BohrFigure() {
  return (
    <Lazy3DFigure
      caption={
        <>
          An incoming proton (violet) binds the end of a chain and forms a new
          salt-bridge clasp, tipping hemoglobin toward the tense (T) state. CO₂
          forms a near-identical clasp nearby. The proton is not drawn to scale.
        </>
      }
    >
      {(active) => (
        <MorphPlayer
          url={BOHR_MORPH_URL}
          active={active}
          accentColor={PROTON_COLOR}
          emphasis={{ element: "H", hex: PROTON_HEX, sizeFactor: PROTON_SIZE }}
          showInteractions
        />
      )}
    </Lazy3DFigure>
  );
}

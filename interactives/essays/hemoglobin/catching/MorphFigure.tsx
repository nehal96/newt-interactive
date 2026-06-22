import dynamic from "next/dynamic";
import Lazy3DFigure, { Loading3D } from "../Lazy3DFigure";

// The two baked O₂-binding morphs. Both play the same deoxy → oxy snap with the
// corrected ~120° lean; the lean variant also carries the distal His hovering
// above (used by the "lean" close-up).
export const BINDING_MORPH_URL = "/structures/heme-oxygenation-morph.pdb";
export const LEAN_MORPH_URL =
  "/structures/heme-oxygenation-morph-distal-his.pdb";

// The player owns its own WebGL engine (Mol*), so it's client-only and lazy —
// kept out of SSR / the initial bundle and only mounted once it nears the screen.
const BindingMorphPlayer = dynamic(() => import("./BindingMorphPlayer"), {
  ssr: false,
  loading: () => <Loading3D />,
});

type MorphFigureProps = {
  /** Which baked morph to play (see the *_MORPH_URL exports above). */
  url: string;
  /**
   * Optional caption shown under the player. The morph is "cartoon-honest" — the
   * iron is drawn oversized and its size change + motion are exaggerated for
   * legibility — so the binding figure uses this to flag that it's not to scale.
   */
  caption?: string;
};

/**
 * A morph figure for Section 2: a play/scrub player for one of the baked
 * O₂-binding morphs, mounted lazily as it nears the viewport (via Lazy3DFigure)
 * and idled while off-screen, so a long essay page never runs more WebGL than it
 * has to.
 */
export default function MorphFigure({ url, caption }: MorphFigureProps) {
  return (
    <Lazy3DFigure caption={caption}>
      {(active) => <BindingMorphPlayer url={url} active={active} />}
    </Lazy3DFigure>
  );
}

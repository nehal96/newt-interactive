import { useRef } from "react";
import dynamic from "next/dynamic";
import { useInViewport } from "../../../../hooks";

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
  loading: () => (
    <div className="flex h-[300px] w-full items-center justify-center rounded-lg bg-slate-50 text-xs text-slate-400 lg:h-[360px]">
      Loading 3D…
    </div>
  ),
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
 * O₂-binding morphs. Boots only when it scrolls near the viewport and idles its
 * render loop while off-screen (via `active`), so a long essay page never runs
 * more WebGL than it has to.
 */
export default function MorphFigure({ url, caption }: MorphFigureProps) {
  const paneRef = useRef<HTMLDivElement>(null);
  const { hasBeenNear, isActive } = useInViewport(paneRef);

  return (
    <figure className="my-8 w-full scroll-mt-24 lg:my-12">
      {/* Cap at 5rem under the prose max (45rem) and center. */}
      <div ref={paneRef} className="mx-auto w-full max-w-[40rem]">
        {hasBeenNear ? (
          <BindingMorphPlayer url={url} active={isActive} />
        ) : (
          <div className="flex h-[300px] w-full items-center justify-center rounded-lg bg-white text-xs text-slate-300 lg:h-[360px]">
            3D model
          </div>
        )}
      </div>
      {caption && (
        <figcaption className="mx-auto mt-3 max-w-xl text-center text-sm text-slate-500">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

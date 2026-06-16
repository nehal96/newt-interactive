import { useRef } from "react";
import dynamic from "next/dynamic";
import { useInViewport } from "../../../../hooks";

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

/**
 * Section 2's "pull" figure: the O₂-binding morph with play/scrub controls.
 * Boots only when it scrolls near the viewport and idles its render loop while
 * off-screen (via `active`), so a long essay page never runs more WebGL than it
 * has to.
 */
export default function BindingMorph() {
  const paneRef = useRef<HTMLDivElement>(null);
  const { hasBeenNear, isActive } = useInViewport(paneRef);

  return (
    <figure className="my-8 w-full scroll-mt-24 lg:my-12">
      <div ref={paneRef} className="mx-auto lg:w-2/3">
        {hasBeenNear ? (
          <BindingMorphPlayer active={isActive} />
        ) : (
          <div className="flex h-[300px] w-full items-center justify-center rounded-lg bg-white text-xs text-slate-300 lg:h-[360px]">
            3D model
          </div>
        )}
      </div>
    </figure>
  );
}

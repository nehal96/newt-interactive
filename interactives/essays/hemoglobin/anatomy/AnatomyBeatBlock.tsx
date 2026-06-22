import { useRef } from "react";
import dynamic from "next/dynamic";
import { useInViewport } from "../../../../hooks";
import { BEATS, type Beat } from "./beats";

// Mol* is client-only (its own WebGL engine) and heavy, so it's lazy-loaded and
// kept out of SSR / the initial bundle.
const MoleculeViewer = dynamic(() => import("./MoleculeViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-lg bg-slate-50 text-xs text-slate-400">
      Loading 3D…
    </div>
  ),
});

type AnatomyBeatBlockProps = {
  beat: Beat;
  /** Anchor id so the parts manifest can scroll-link to this block. */
  id?: string;
};

/**
 * One inline beat of the anatomy build-up: a 3D model of the part being added.
 * The viewer is mounted lazily — only once the block scrolls near the viewport —
 * and paused whenever it scrolls back off-screen, so a page full of these never
 * boots or animates more WebGL contexts than it has to.
 */
export default function AnatomyBeatBlock({ beat, id }: AnatomyBeatBlockProps) {
  const { viewer } = BEATS[beat];

  // Observe the 3D pane: boot when near, animate only while it's on-screen.
  const paneRef = useRef<HTMLDivElement>(null);
  const { hasBeenNear, isActive } = useInViewport(paneRef);

  return (
    <figure id={id} className="my-8 w-full scroll-mt-24 lg:my-12">
      {/* Cap at 5rem under the prose max (45rem) and center. */}
      <div
        ref={paneRef}
        className="relative mx-auto h-[300px] w-full max-w-[40rem] overflow-hidden rounded-lg bg-white lg:h-[360px]"
      >
        {hasBeenNear ? (
          <MoleculeViewer
            key={beat}
            {...viewer}
            active={isActive}
            className="rounded-lg"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-slate-300">
            3D model
          </div>
        )}
      </div>
    </figure>
  );
}

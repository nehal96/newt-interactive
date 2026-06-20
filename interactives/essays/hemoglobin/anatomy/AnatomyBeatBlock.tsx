import { useRef } from "react";
import dynamic from "next/dynamic";
import { cn } from "../../../../lib/utils";
import { useInViewport } from "../../../../hooks";
import { BEATS, type Beat } from "./beats";

// Mol* is client-only (its own WebGL engine) and heavy, so it's lazy-loaded and
// kept out of SSR / the initial bundle. The annotated SVGs are plain markup.
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
 * One inline beat of the anatomy build-up: a self-contained figure that pairs a
 * flat annotated SVG with its 3D model (side-by-side), or shows the 3D model
 * alone for the pocket beats that have no schematic. The 3D viewer is mounted
 * lazily — only once the block scrolls near the viewport — and paused whenever
 * it scrolls back off-screen, so a page full of these never boots or animates
 * more WebGL contexts than it has to.
 */
export default function AnatomyBeatBlock({ beat, id }: AnatomyBeatBlockProps) {
  const { Svg, viewer } = BEATS[beat];
  const hasSvg = Svg != null;

  // Observe the 3D pane: boot when near, animate only while it's on-screen.
  const paneRef = useRef<HTMLDivElement>(null);
  const { hasBeenNear, isActive } = useInViewport(paneRef);

  return (
    <figure id={id} className="my-8 w-full scroll-mt-24 lg:my-12">
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-center">
        {hasSvg && (
          <div className="relative h-[300px] w-full rounded-lg border border-slate-200 bg-white lg:h-[360px] lg:w-1/2">
            <Svg />
          </div>
        )}
        <div
          ref={paneRef}
          className={cn(
            "relative h-[300px] w-full overflow-hidden rounded-lg bg-white lg:h-[360px]",
            // Standalone: cap at 5rem under the prose max (45rem) and center.
            hasSvg ? "lg:w-1/2" : "mx-auto max-w-[40rem]",
          )}
        >
          {hasBeenNear ? (
            <MoleculeViewer
              key={beat}
              url={viewer.url}
              representation={viewer.representation}
              uniformColor={viewer.uniformColor}
              sizeFactor={viewer.sizeFactor}
              emphasizeIron={viewer.emphasizeIron}
              chainGroups={viewer.chainGroups}
              showPockets={viewer.showPockets}
              pocketChains={viewer.pocketChains}
              active={isActive}
              className="rounded-lg"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-slate-300">
              3D model
            </div>
          )}
        </div>
      </div>
    </figure>
  );
}

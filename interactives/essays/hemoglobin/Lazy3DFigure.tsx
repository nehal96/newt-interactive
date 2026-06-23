import { type ReactNode, useRef } from "react";
import { useInViewport } from "../../../hooks";

// The shared shell for an inline 3D-morph figure. Owns the lazy lifecycle every
// such figure needs — boot the (heavy, client-only) player only once it scrolls
// near the viewport, and pause it while off-screen — plus the centered pane and
// optional caption. Callers supply just the player (already code-split via
// next/dynamic) and a caption. See MorphFigure (catching) and BohrFigure
// (releasing) for the two callers.

// Loading state for a lazily-imported player chunk (pass as dynamic()'s
// `loading`). Same height as the player so the layout doesn't jump.
export function Loading3D() {
  return (
    <div className="flex h-[300px] w-full items-center justify-center rounded-lg bg-slate-50 text-xs text-slate-400 lg:h-[360px]">
      Loading 3D…
    </div>
  );
}

type Lazy3DFigureProps = {
  /**
   * Renders the (already code-split) player once the figure nears the viewport.
   * `active` follows on-screen visibility so the player can idle its render loop.
   */
  children: (active: boolean) => ReactNode;
  caption?: ReactNode;
};

export default function Lazy3DFigure({ children, caption }: Lazy3DFigureProps) {
  const paneRef = useRef<HTMLDivElement>(null);
  const { hasBeenNear, isActive } = useInViewport(paneRef);

  return (
    <figure className="my-8 w-full scroll-mt-24 lg:my-12">
      {/* Cap at 5rem under the prose max (45rem) and center. */}
      <div ref={paneRef} className="mx-auto w-full max-w-[40rem]">
        {hasBeenNear ? (
          children(isActive)
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

import { RefObject, useEffect, useState } from "react";

type Options = {
  /**
   * Mount margin: `hasBeenNear` latches true once the element first comes
   * within this distance of the viewport, so a heavy viewer can boot just
   * before it scrolls into view (and then stay mounted).
   */
  nearMargin?: string;
  /**
   * Active margin: `isActive` follows visibility within this margin, so a
   * mounted viewer can idle its render loop while off-screen.
   */
  activeMargin?: string;
};

/**
 * Tracks an element's relationship to the viewport for lazy, expensive content
 * (e.g. a Mol* WebGL viewer). `hasBeenNear` is a one-way latch for "mount it
 * now"; `isActive` is a live flag for "it's on-screen, keep it animating".
 * Splitting the two lets us pre-boot a viewer before it's visible yet pause it
 * whenever it leaves the screen — without ever tearing the context back down.
 */
export function useInViewport<T extends Element>(
  ref: RefObject<T | null>,
  { nearMargin = "300px", activeMargin = "0px" }: Options = {}
) {
  const [hasBeenNear, setHasBeenNear] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      // No observer support (or no node): fail open so content still renders.
      setHasBeenNear(true);
      setIsActive(true);
      return;
    }

    const near = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasBeenNear(true);
          near.disconnect(); // one-way latch — done once it's mounted
        }
      },
      { rootMargin: nearMargin }
    );
    const active = new IntersectionObserver(
      ([entry]) => setIsActive(entry.isIntersecting),
      { rootMargin: activeMargin }
    );
    near.observe(el);
    active.observe(el);

    return () => {
      near.disconnect();
      active.disconnect();
    };
  }, [ref, nearMargin, activeMargin]);

  return { hasBeenNear, isActive };
}

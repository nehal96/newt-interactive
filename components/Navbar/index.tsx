import Link from "next/link";
import type { MouseEvent } from "react";

/**
 * Subscribe goes to the nearest subscribe block: the one at the foot of this
 * article if it has one, the homepage's otherwise. Which it is can only be
 * known in the browser — MdxLayout doesn't see whether the MDX below it ends
 * with a PostArticleSubscribe — so the href stays the homepage anchor (right
 * without JS, right for a middle-click) and the click prefers a local one.
 */
const goToNearestSubscribe = (e: MouseEvent<HTMLAnchorElement>) => {
  // Leave modified clicks alone: they mean "open this somewhere else".
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const here = document.getElementById("subscribe");
  if (!here) return;
  e.preventDefault();
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  here.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  history.replaceState(null, "", "#subscribe");
};

// A quiet header: a hairline, the wordmark, one link. The indigo band from the
// old navbar survives as frosted glass — a tinted, translucent pane the page
// slides under. `saturate` is what makes it read as glass rather than as a
// grey film: the blur alone washes out whatever passes beneath, and pushing
// the colour back up keeps a cover's indigo visible through the pane. The
// white top hairline is the lit edge; the indigo one below is the shadow.
//
// The tint is a pale indigo laid on fairly thickly rather than a stronger one
// held back. Same lightness either way over paper, but over a saturated cover
// the thicker pane keeps its own colour instead of going pink with whatever is
// passing under it.
const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-glass-edge/50 bg-glass-pane/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex h-14 w-full max-w-column items-center justify-between px-5">
        <Link href="/" className="group inline-flex items-baseline gap-1.5">
          <span className="font-logo text-xl leading-none text-ink-900">
            newt
          </span>
          <span className="font-body text-base leading-none text-ink-500 transition-colors group-hover:text-ink-800">
            interactive
          </span>
        </Link>
        <Link
          href="/#subscribe"
          onClick={goToNearestSubscribe}
          className="text-sm text-ink-500 transition-colors hover:text-ink-900"
        >
          Subscribe
        </Link>
      </div>
    </header>
  );
};

export default Navbar;

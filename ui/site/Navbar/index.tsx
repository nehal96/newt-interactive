import Link from "next/link";
import type { MouseEvent } from "react";

/** The href stays the homepage anchor — right without JS, and right for a
 *  click that means "open this somewhere else". Only a plain click is taken
 *  over, and only when this page has a subscribe block of its own. */
const goToNearestSubscribe = (e: MouseEvent<HTMLAnchorElement>) => {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const here = document.getElementById("subscribe");
  if (!here) return;
  e.preventDefault();
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  here.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  history.replaceState(null, "", "#subscribe");
};

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

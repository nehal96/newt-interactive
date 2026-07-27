import Link from "next/link";

// A quiet header: a hairline, the wordmark, one link. The indigo band from the
// old navbar survives as frosted glass — a tinted, translucent pane the page
// slides under. `saturate` is what makes it read as glass rather than as a
// grey film: the blur alone washes out whatever passes beneath, and pushing
// the colour back up keeps a cover's indigo visible through the pane. The
// white top hairline is the lit edge; the indigo one below is the shadow.
const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-indigo-200/70 bg-indigo-100/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-xl backdrop-saturate-150">
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
          className="text-sm text-ink-500 transition-colors hover:text-ink-900"
        >
          Subscribe
        </Link>
      </div>
    </header>
  );
};

export default Navbar;

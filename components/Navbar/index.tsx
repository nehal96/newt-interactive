import Link from "next/link";

// A quiet header: a hairline, the wordmark, one link. The indigo band from the
// old navbar survives as a wash — light and translucent enough that the page
// still reads as one sheet of paper, and nothing competes with the figures.
const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-indigo-100/80 bg-indigo-50/70 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-column items-center justify-between px-5">
        <Link href="/" className="group inline-flex items-baseline gap-1.5">
          <span className="font-logo text-xl leading-none text-slate-900">
            newt
          </span>
          <span className="font-body text-base leading-none text-slate-500 transition-colors group-hover:text-slate-800">
            interactive
          </span>
        </Link>
        <Link
          href="/#subscribe"
          className="text-sm text-slate-500 transition-colors hover:text-slate-900"
        >
          Subscribe
        </Link>
      </div>
    </header>
  );
};

export default Navbar;

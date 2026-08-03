import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { cn } from "@lib/utils";

interface Entry {
  id: string;
  label: string;
  level: 2 | 3;
}

/** Under this many headings the rail is decoration, not navigation. */
const MIN_HEADINGS = 3;
/** Clearance between the rail and a figure before the rail gives way. */
const CLEARANCE = 24;

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;

const scrollPaddingTop = () =>
  parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;

const collect = (article: Element): Entry[] => {
  const headings = Array.from(
    article.querySelectorAll<HTMLElement>("h2[id], h3[id]")
  );
  if (headings.length < MIN_HEADINGS) return [];

  const entries: Entry[] = headings.map((heading) => ({
    id: heading.id,
    label: heading.textContent?.trim() ?? "",
    level: heading.tagName === "H3" ? 3 : 2,
  }));

  const opening = article.querySelector<HTMLElement>(
    "p:not([data-article-meta])"
  );
  if (
    opening &&
    headings[0].compareDocumentPosition(opening) &
      Node.DOCUMENT_POSITION_PRECEDING
  ) {
    if (!opening.id) opening.id = "introduction";
    entries.unshift({ id: opening.id, label: "Introduction", level: 2 });
  }

  return entries;
};

const TableOfContents = () => {
  const navRef = useRef<HTMLElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const linkRefs = useRef(new Map<string, HTMLAnchorElement>());
  const scrollAnimation = useRef<number | null>(null);

  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    const article = document.querySelector("article");
    if (article) setEntries(collect(article));
  }, []);

  // The list is the only thing React renders. Which entry is lit, where the dot
  // sits and whether a figure is in the way all change on scroll frames, and
  // routing those through state paints the rail a frame behind the layout.
  useEffect(() => {
    const nav = navRef.current;
    const dot = dotRef.current;
    const article = nav?.closest("article");
    if (!nav || !dot || !article || !entries.length) return;

    let frame: number | null = null;
    let obstacles: HTMLElement[] = [];
    let lineHeight = 0;
    let lit = "";
    let stale = true;

    const survey = () => {
      lineHeight = parseFloat(getComputedStyle(nav).lineHeight) || 0;

      const rail = nav.getBoundingClientRect();
      if (!rail.width) {
        obstacles = [];
        return;
      }

      const style = getComputedStyle(article);
      const columnWidth =
        article.clientWidth -
        parseFloat(style.paddingLeft) -
        parseFloat(style.paddingRight);

      const pool = new Set<HTMLElement>();
      article.querySelectorAll<HTMLElement>("figure, table").forEach((el) => {
        pool.add(el);
        Array.from(el.children).forEach((child) => pool.add(child as HTMLElement));
      });

      obstacles = Array.from(pool).filter((el) => {
        const box = el.getBoundingClientRect();
        // A figure spanning the whole column is a wrapper around centred ink.
        // Only one that stops short of it has really broken out toward the rail.
        if (!box.width || box.width >= columnWidth - 1) return false;
        return (
          box.left < rail.right + CLEARANCE && box.right > rail.left - CLEARANCE
        );
      });
    };

    const current = () => {
      const doc = document.documentElement;
      // A final section shorter than the viewport never crosses the line.
      if (window.scrollY + window.innerHeight >= doc.scrollHeight - 2)
        return entries[entries.length - 1];

      const line = window.scrollY + scrollPaddingTop() + CLEARANCE;
      let found = entries[0];
      for (const entry of entries) {
        const heading = document.getElementById(entry.id);
        if (heading && heading.getBoundingClientRect().top + window.scrollY <= line)
          found = entry;
      }
      return found;
    };

    const paint = () => {
      frame = null;
      if (stale) {
        survey();
        stale = false;
      }

      const { id } = current();
      const changed = id !== lit;
      const first = lit === "";
      if (changed) {
        linkRefs.current.get(lit)?.removeAttribute("aria-current");
        linkRefs.current.get(id)?.setAttribute("aria-current", "location");
        lit = id;
      }

      const link = linkRefs.current.get(id);
      if (link) {
        // Half a line rather than half the box, so a wrapped entry is marked
        // on its first line instead of between its two.
        const y = link.offsetTop + lineHeight / 2;
        const next = `translate3d(0, calc(${y}px - 50%), 0)`;
        if (next !== dot.style.transform) {
          // Travelling to another entry is the animation. Following the entry
          // it already marks through a reflow is a correction, and a correction
          // that eases arrives after the text it is meant to be pinned to.
          const glide = changed && !first;
          if (!glide) dot.style.transitionProperty = "none";
          dot.style.transform = next;
          dot.style.opacity = "1";
          if (!glide) {
            void dot.offsetHeight;
            dot.style.transitionProperty = "";
          }
        }
      }

      const rail = nav.getBoundingClientRect();
      nav.dataset.obstructed = String(
        obstacles.some((el) => {
          const box = el.getBoundingClientRect();
          return (
            box.top < rail.bottom + CLEARANCE &&
            box.bottom > rail.top - CLEARANCE
          );
        })
      );
    };

    const schedule = () => {
      if (frame === null) frame = requestAnimationFrame(paint);
    };

    const onResize = () => {
      stale = true;
      schedule();
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
    };
  }, [entries]);

  useEffect(
    () => () => {
      if (scrollAnimation.current !== null)
        cancelAnimationFrame(scrollAnimation.current);
    },
    []
  );

  const goTo = (event: MouseEvent, id: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = document.getElementById(id);
    if (!target) return;

    event.preventDefault();
    history.pushState(null, "", `#${id}`);

    const to = Math.max(
      0,
      target.getBoundingClientRect().top + window.scrollY - scrollPaddingTop()
    );
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.scrollTo(0, to);
      return;
    }

    if (scrollAnimation.current !== null)
      cancelAnimationFrame(scrollAnimation.current);

    const from = window.scrollY;
    const distance = to - from;
    // A short hop should feel instant, a long one shouldn't crawl.
    const duration = Math.min(900, Math.max(350, Math.abs(distance) * 0.25));
    const start = performance.now();

    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      window.scrollTo(0, from + distance * easeInOutCubic(t));
      scrollAnimation.current = t < 1 ? requestAnimationFrame(step) : null;
    };
    scrollAnimation.current = requestAnimationFrame(step);
  };

  if (!entries.length) return null;

  return (
    // A zero-height flex item: it sits at the prose's first line by flow rather
    // than by measurement, and costs the column no vertical space.
    <div className="sticky top-[5.5rem] ml-[calc(50%-36.5rem)] hidden h-0 w-48 self-start min-[1200px]:block">
      <nav
        ref={navRef}
        aria-label="Table of contents"
        // The top padding sits the first line on the prose's, whose line box
        // is taller; it tracks half the difference between the two.
        className="no-scrollbar relative max-h-[calc(100vh-7rem)] overflow-y-auto pl-5 pt-1.5 font-ui text-xs leading-snug transition-opacity duration-200 data-[obstructed=true]:pointer-events-none data-[obstructed=true]:opacity-0"
      >
        <ul>
          {entries.map((entry) => (
            <li
              key={entry.id}
              className={cn("mb-3 last:mb-0", entry.level === 3 && "pl-3")}
            >
              <a
                ref={(el) => {
                  if (el) linkRefs.current.set(entry.id, el);
                  else linkRefs.current.delete(entry.id);
                }}
                href={`#${entry.id}`}
                onClick={(event) => goTo(event, entry.id)}
                className="block text-ink-400 transition-colors duration-200 hover:text-ink-800 aria-[current=location]:text-ink-900"
              >
                {entry.label}
              </a>
            </li>
          ))}
        </ul>
        <span
          aria-hidden
          ref={dotRef}
          className="pointer-events-none absolute left-2 top-0 h-1 w-1 rounded-full bg-indigo-500 opacity-0 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
        />
      </nav>
    </div>
  );
};

export default TableOfContents;

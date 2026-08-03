import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { useMediaQuery } from "@hooks";
import { cn } from "@lib/utils";

interface Entry {
  id: string;
  label: string;
  level: 2 | 3;
}

const MIN_HEADINGS = 3;
const RAIL_GAP = 24;
const TRIGGER_OFFSET = 24;
const RAIL_FITS = "(min-width: 1200px)";
const INTRO_ID = "introduction";

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;

const scrollPaddingTop = () =>
  parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;

const collect = (anchor: HTMLElement): Entry[] => {
  const article = anchor.closest("article");
  if (!article) return [];

  const headings = Array.from(
    article.querySelectorAll<HTMLElement>("h2[id], h3[id]")
  );
  if (headings.length < MIN_HEADINGS) return [];

  const entries: Entry[] = headings.map((heading) => ({
    id: heading.id,
    label: heading.textContent?.trim() ?? "",
    level: heading.tagName === "H3" ? 3 : 2,
  }));

  const opening = Array.from(article.querySelectorAll("p")).find(
    (paragraph) =>
      anchor.compareDocumentPosition(paragraph) &
      Node.DOCUMENT_POSITION_FOLLOWING
  );
  if (
    opening &&
    headings[0].compareDocumentPosition(opening) &
      Node.DOCUMENT_POSITION_PRECEDING
  )
    entries.unshift({ id: INTRO_ID, label: "Introduction", level: 2 });

  return entries;
};

const TableOfContents = () => {
  const anchorRef = useRef<HTMLSpanElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const scrollAnimation = useRef<number | null>(null);

  const [entries, setEntries] = useState<Entry[]>([]);
  const railFits = useMediaQuery(RAIL_FITS);
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  useEffect(() => {
    if (!railFits) {
      setEntries([]);
      return;
    }
    const anchor = anchorRef.current;
    if (anchor) setEntries(collect(anchor));
  }, [railFits]);

  // Scroll state is written to the DOM directly; routing it through React
  // paints the rail a frame behind the layout.
  useEffect(() => {
    const nav = navRef.current;
    const dot = dotRef.current;
    const article = nav?.closest("article");
    if (!nav || !dot || !article || !entries.length) return;

    const links = Array.from(nav.querySelectorAll("a"));
    const targets = entries.map((entry) => document.getElementById(entry.id));

    let frame: number | null = null;
    let stale = true;
    let lit = -1;
    let obstructed: boolean | null = null;
    let trigger = 0;
    let tops: number[] = [];
    let offsets: number[] = [];
    let bands: [number, number][] = [];

    const survey = () => {
      const scrolled = window.scrollY;
      const lineHeight = parseFloat(getComputedStyle(nav).lineHeight) || 0;
      trigger = scrollPaddingTop() + TRIGGER_OFFSET;

      tops = targets.map((el) =>
        el ? el.getBoundingClientRect().top + scrolled : Infinity
      );
      // Half a line rather than half the box, so a wrapped entry is marked on
      // its first line instead of between its two.
      offsets = links.map((link) => link.offsetTop + lineHeight / 2);

      bands = [];
      const rail = nav.getBoundingClientRect();
      if (!rail.width) return;

      const style = getComputedStyle(article);
      const columnWidth =
        article.clientWidth -
        parseFloat(style.paddingLeft) -
        parseFloat(style.paddingRight);

      const candidates: HTMLElement[] = [];
      article.querySelectorAll<HTMLElement>("figure, table").forEach((el) => {
        candidates.push(el, ...(Array.from(el.children) as HTMLElement[]));
      });

      for (const el of candidates) {
        const box = el.getBoundingClientRect();
        // A figure spanning the whole column is a wrapper around centred ink.
        // Only one that stops short of it has really broken out toward the rail.
        if (!box.width || box.width >= columnWidth - 1) continue;
        if (box.left < rail.right + RAIL_GAP && box.right > rail.left - RAIL_GAP)
          bands.push([box.top + scrolled, box.bottom + scrolled]);
      }
    };

    const paint = () => {
      frame = null;
      if (stale) {
        survey();
        stale = false;
      }

      const scrolled = window.scrollY;
      const rail = nav.getBoundingClientRect();
      const line = scrolled + trigger;

      let index = 0;
      for (let i = 0; i < tops.length; i++) if (tops[i] <= line) index = i;
      // A final section shorter than the viewport never crosses the line.
      if (scrolled + window.innerHeight >= document.documentElement.scrollHeight - 2)
        index = entries.length - 1;

      const blocked = bands.some(
        ([top, bottom]) =>
          top < scrolled + rail.bottom + RAIL_GAP &&
          bottom > scrolled + rail.top - RAIL_GAP
      );

      const changed = index !== lit;
      if (changed) {
        links[lit]?.removeAttribute("aria-current");
        links[index]?.setAttribute("aria-current", "location");
      }

      const next = `translate3d(0, calc(${offsets[index]}px - 50%), 0)`;
      if (next !== dot.style.transform) {
        // Travelling to another entry is the animation. Following the entry it
        // already marks through a reflow is a correction, and a correction that
        // eases arrives after the text it is meant to be pinned to.
        dot.style.transitionProperty = changed && lit !== -1 ? "" : "none";
        dot.style.transform = next;
        dot.style.opacity = "1";
      }
      lit = index;

      if (blocked !== obstructed) {
        nav.dataset.obstructed = String(blocked);
        obstructed = blocked;
      }
    };

    const schedule = () => {
      if (frame === null) frame = requestAnimationFrame(paint);
    };

    const resurvey = () => {
      stale = true;
      schedule();
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", resurvey);
    // A figure mounting late moves every heading below it.
    const observer = new ResizeObserver(resurvey);
    observer.observe(article);

    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", resurvey);
      observer.disconnect();
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
    if (reduceMotion) {
      window.scrollTo(0, to);
      return;
    }

    if (scrollAnimation.current !== null)
      cancelAnimationFrame(scrollAnimation.current);

    const from = window.scrollY;
    const distance = to - from;
    const duration = Math.min(900, Math.max(350, Math.abs(distance) * 0.25));
    const start = performance.now();

    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      window.scrollTo(0, from + distance * easeInOutCubic(t));
      scrollAnimation.current = t < 1 ? requestAnimationFrame(step) : null;
    };
    scrollAnimation.current = requestAnimationFrame(step);
  };

  return (
    <>
      <span ref={anchorRef} id={INTRO_ID} aria-hidden />
      {entries.length > 0 && (
        <div className="sticky top-[5.5rem] ml-[calc(50%-theme(maxWidth.prose)/2-14rem)] hidden h-0 w-48 self-start min-[1200px]:block">
          <nav
            ref={navRef}
            aria-label="Table of contents"
            className="no-scrollbar relative max-h-[calc(100vh-7rem)] overflow-y-auto pl-5 pt-1.5 font-ui text-xs leading-snug transition-opacity duration-200 data-[obstructed=true]:pointer-events-none data-[obstructed=true]:opacity-0"
          >
            <ul>
              {entries.map((entry) => (
                <li
                  key={entry.id}
                  className={cn("mb-3 last:mb-0", entry.level === 3 && "pl-3")}
                >
                  <a
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
              className="pointer-events-none absolute left-2 top-0 h-1 w-1 rounded-full bg-indigo-500 opacity-0 transition-all duration-300 ease-out-quint will-change-transform"
            />
          </nav>
        </div>
      )}
    </>
  );
};

export default TableOfContents;

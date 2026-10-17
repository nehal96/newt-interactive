// A footnote that sits in the right margin on wide screens and falls back to the hover tooltip below that.
import { useEffect, type ReactNode } from "react";
import TippyTooltip, { TippyTooltipContent } from "@ui/controls/TippyTooltip";

const NOTE = "fs-sidenote";
const GAP = 12;
const OFFSET_REM = 2.5;

/** Pushes each note out to the margin beside its line, and down past the note above it. */
function layout() {
  const notes = Array.from(document.querySelectorAll<HTMLElement>(`.${NOTE}`));
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
  for (const n of notes) n.style.transform = "";
  let floor = -Infinity;
  notes.forEach((note, i) => {
    const num = note.querySelector("[data-n]");
    if (num) num.textContent = `${i + 1}.`;
    const r = note.getBoundingClientRect();
    if (!r.width) return;
    const column = note.closest("p")?.getBoundingClientRect();
    const dx = column ? column.right + OFFSET_REM * rem - r.left : 0;
    const top = Math.max(r.top, floor + GAP);
    note.style.transform = `translate(${dx}px, ${top - r.top}px)`;
    floor = top + r.height;
  });
}

let users = 0;
let frame = 0;
let observer: ResizeObserver | null = null;
const schedule = () => {
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(layout);
};

function useSidenoteLayout() {
  useEffect(() => {
    users++;
    if (!observer) {
      observer = new ResizeObserver(schedule);
      observer.observe(document.body);
      document.fonts?.ready.then(schedule);
    }
    schedule();
    return () => {
      users--;
      if (!users && observer) {
        observer.disconnect();
        observer = null;
      }
    };
  }, []);
}

export default function Sidenote({ children }: { children: ReactNode }) {
  useSidenoteLayout();
  return (
    <>
      <span className="xl:hidden">
        <TippyTooltip
          variant="footnote"
          content={<TippyTooltipContent>{children}</TippyTooltipContent>}
        />
      </span>
      <span className="hidden xl:inline">
        <sup className="newt-footnote-marker cursor-default" />
        <span
          className={`${NOTE} absolute z-10 w-56 font-body text-[0.8125rem] font-normal leading-[1.45] text-ink-500 [overflow-wrap:anywhere]`}
        >
          <span data-n className="mr-1 font-semibold text-ink-700" />
          {children}
        </span>
      </span>
    </>
  );
}

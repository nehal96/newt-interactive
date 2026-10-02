import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@lib/utils";
import { type Book, formatYear } from "./books";

// Grid covers are sized in millimetres times --mm, so one breakpoint rescales the whole table.
const mm = (v: number) => `calc(${v} * var(--mm))`;

function Cover({ book, height, sizes, preload, className }: { book: Book; height: number | string; sizes: string; preload?: boolean; className?: string }) {
  const width = typeof height === "number" ? (height * book.widthMm) / book.heightMm : mm(book.widthMm);
  if (book.cover) {
    return (
      <Image
        src={book.cover.src}
        width={book.cover.width}
        height={book.cover.height}
        sizes={sizes}
        preload={preload}
        alt=""
        draggable={false}
        className={cn("block shadow-[0_1px_2px_rgba(26,24,37,.18),0_10px_24px_-10px_rgba(26,24,37,.4)]", className)}
        style={{ width, height, background: book.cover.color }}
      />
    );
  }
  // No edition-exact cover yet: a typeset stand-in rather than someone else's edition.
  const compact = typeof height === "number" && height < 120;
  return (
    <div
      className={cn("flex flex-col justify-between bg-ink-100 p-[8%] shadow-[0_1px_2px_rgba(26,24,37,.12)] [container-type:inline-size]", className)}
      style={{ width, height }}
    >
      {compact ? (
        <p className="m-auto font-title text-lg leading-none text-ink-400">{book.title.replace(/^(the|a|an)\s+/i, "")[0]}</p>
      ) : (
        <>
          <p className="font-title text-sm leading-tight text-ink-800" style={{ fontSize: "11cqw" }}>
            {book.title}
          </p>
          <p className="font-ui text-[0.625rem] text-ink-500" style={{ fontSize: "7cqw" }}>
            {book.authors[0]}
          </p>
        </>
      )}
    </div>
  );
}

function Meta({ book, align = "left" }: { book: Book; align?: "left" | "right" }) {
  const label = book.format && book.format !== "magazine" ? book.format.replace("-", " ") : null;
  return (
    <div className={cn("flex flex-col gap-1", align === "right" ? "items-end text-right" : "items-start")}>
      <p className="flex gap-x-3 font-ui text-sm text-ink-600">
        <span>{book.publisher}</span>
        {book.year != null && <span className="whitespace-nowrap tabular-nums text-ink-500">{formatYear(book.year)}</span>}
      </p>
      {label && <p className="font-mono text-[0.625rem] uppercase tracking-[0.1em] text-ink-400">{label}</p>}
    </div>
  );
}

// Index of the wrapped row each item sits in. Items are bottom-aligned, so a row shares a bottom edge.
function measureRows(items: HTMLElement[]) {
  const rows: number[] = [];
  let row = -1;
  let bottom = -Infinity;
  for (const el of items) {
    const b = el.offsetTop + el.offsetHeight;
    if (Math.abs(b - bottom) > 2) {
      row++;
      bottom = b;
    }
    rows.push(row);
  }
  return rows;
}

const CAPTION_GAP = 12;
const ABOVE_FOLD = 6;
const CAPTION_CLEARANCE = 36;

export function Grid({ books }: { books: Book[] }) {
  const listRef = useRef<HTMLUListElement>(null);
  const [rows, setRows] = useState<number[]>([]);
  const [open, setOpen] = useState<{ row: number; space: number }>();

  useEffect(() => {
    const ul = listRef.current!;
    const measure = () => setRows(measureRows(Array.from(ul.children) as HTMLElement[]));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(ul);
    return () => ro.disconnect();
  }, [books]);

  const reveal = (i: number, li: HTMLElement) => {
    const caption = li.querySelector<HTMLElement>("[data-caption]")!;
    const gap = parseFloat(getComputedStyle(listRef.current!).rowGap);
    setOpen({ row: rows[i], space: Math.max(0, caption.offsetHeight + CAPTION_GAP + CAPTION_CLEARANCE - gap) });
  };

  return (
    <ul
      ref={listRef}
      onMouseLeave={() => setOpen(undefined)}
      className="flex flex-wrap items-end gap-x-5 gap-y-12 [--mm:0.5px] sm:gap-x-9 sm:gap-y-14 sm:[--mm:0.82px]"
    >
      {books.map((b, i) => (
        <li
          key={b.id}
          tabIndex={0}
          onMouseEnter={(e) => reveal(i, e.currentTarget)}
          onFocus={(e) => reveal(i, e.currentTarget)}
          onBlur={() => setOpen(undefined)}
          className="group relative transition-[margin] duration-300 ease-out"
          style={{ marginBottom: open && rows[i] === open.row ? open.space : 0 }}
        >
          <div className="transition-transform duration-300 ease-out group-hover:-translate-y-1.5 group-focus:-translate-y-1.5">
            <Cover book={b} height={mm(b.heightMm)} sizes="(min-width: 640px) 180px, 110px" preload={i < ABOVE_FOLD} />
          </div>
          <div
            data-caption
            className="pointer-events-none absolute left-0 top-full z-10 w-40 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus:opacity-100 sm:w-48"
            style={{ marginTop: CAPTION_GAP }}
          >
            <p className="font-title text-[0.95rem] leading-tight text-ink-900">{b.title}</p>
            <p className="mt-0.5 font-ui text-xs text-ink-500">{b.authors.join(", ")}</p>
          </div>
          <span className="sr-only">
            {b.title} by {b.byline}
          </span>
        </li>
      ))}
    </ul>
  );
}

const LIST_THUMB = 64;

export function List({ books }: { books: Book[] }) {
  return (
    <ul>
      {books.map((b) => {
        const label = b.format && b.format !== "magazine" ? b.format.replace("-", " ") : null;
        return (
          <li
            key={b.id}
            className="grid grid-cols-[3rem_minmax(0,1fr)] content-center items-baseline gap-x-5 border-b border-ink-100 py-4 sm:grid-cols-[3rem_minmax(0,1fr)_auto] sm:gap-x-8"
            style={{ minHeight: LIST_THUMB + 32 }}
          >
            <div className="row-span-3 self-center sm:row-span-2">
              <Cover book={b} height={LIST_THUMB} sizes="48px" />
            </div>
            <h2 className="font-title text-xl leading-tight text-ink-900">{b.title}</h2>
            <p className="hidden max-w-[18rem] justify-end gap-x-3 text-right font-ui text-sm text-ink-600 sm:flex">
              <span>{b.publisher}</span>
              {b.year != null && <span className="whitespace-nowrap tabular-nums text-ink-500">{formatYear(b.year)}</span>}
            </p>
            <p className="col-start-2 font-ui text-[0.9375rem] text-ink-500">{b.byline}</p>
            <p className="hidden text-right font-mono text-[0.625rem] uppercase tracking-[0.1em] text-ink-400 sm:block">{label}</p>
            <div className="col-start-2 mt-2 sm:hidden">
              <Meta book={b} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

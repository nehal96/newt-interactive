import Link from "next/link";
import Image from "next/image";
import { cn } from "../../lib/utils";
import CoverArt from "../CoverArt";
import {
  KIND_LABEL,
  formatMonth,
  type Piece,
  type SeriesPart,
} from "../../lib/content";

/* ------------------------------------------------------------------ *
 * The index
 *
 * One centred column, one rule between rows, no boxes. Each entry shows
 * what it is, when it landed, and its cover — drawn from the shared
 * vocabulary in components/CoverArt, so the set agrees with itself by
 * construction rather than by luck.
 * ------------------------------------------------------------------ */

/** A piece's cover, from whichever source it has. */
const Cover = ({
  piece,
  src,
  sizes,
  priority,
  zoom,
}: {
  piece: Piece;
  /** The image file to use, when the piece has one rather than a motif. */
  src?: string;
  sizes: string;
  priority?: boolean;
  /** Hover growth. Drawn covers take it slightly harder — vector, so it's free. */
  zoom: string;
}) => {
  const grow = cn("transition-transform duration-500 ease-out", zoom);

  return piece.art ? (
    <CoverArt motif={piece.art} className={cn("h-full w-full", grow)} />
  ) : (
    <Image
      src={src}
      alt=""
      fill
      priority={priority}
      sizes={sizes}
      className={cn("object-cover", grow)}
    />
  );
};

/**
 * Kind, extent, date — one line, no punctuation between them. The hierarchy is
 * carried by the type itself: the kind is a mono label, tracked caps and the
 * darkest of the three; the rest is sans a shade back; and a wide gap does the
 * separating that a middot used to. Three registers read as three fields; a
 * row of dots reads as a sentence that got compressed.
 */
const Meta = ({ piece }: { piece: Piece }) => (
  <p className="flex flex-wrap items-baseline gap-x-4 gap-y-1 font-ui text-xs">
    {/* Mono needs less letter-spacing than a sans does to read as a label —
        the glyphs already carry their own. */}
    <span className="font-mono text-[0.6875rem] uppercase tracking-[0.09em] text-ink-500">
      {KIND_LABEL[piece.kind]}
    </span>
    {/* The part count is the first thing to go when the line would wrap. */}
    {piece.parts ? (
      <span className="hidden tabular-nums tracking-[0.02em] text-ink-400 sm:inline">
        {piece.parts.length} parts
      </span>
    ) : null}
    {/* Tabular figures and a little extra letter-spacing: at 12px grey the
        default proportional numerals set tighter than the words beside them,
        so the date reads as a clump. */}
    <span className="tabular-nums tracking-[0.02em] text-ink-400">
      {formatMonth(piece.published)}
    </span>
  </p>
);

/** The lead item: same anatomy as a row, given most of the column width. */
export const FeaturedPiece = ({ piece }: { piece: Piece }) => (
  <Link
    href={piece.href}
    className="group block"
    // The title's hover colour, so a piece with a strong cover can answer it.
    // Indigo-700 unless the row names its own.
    style={{ "--accent": piece.accent ?? "#4338ca" } as React.CSSProperties}
  >
    {/* Full column width — the lead piece gets the whole measure. */}
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded bg-white ring-1 ring-ink-200/70">
      <Cover
        piece={piece}
        src={piece.cover}
        priority
        sizes="(min-width: 768px) 46rem, 100vw"
        zoom="group-hover:scale-[1.02]"
      />
    </div>
    <div className="mt-5">
      <Meta piece={piece} />
      {/* The page's h1. With the colophon demoted to a paragraph, the lead
          piece is the only thing on the index that could be its header — and
          it's the top of the page, so the outline reads in document order. */}
      <h1 className="mt-2 font-title text-3xl leading-tight text-ink-900 transition-colors group-hover:text-[color:var(--accent)] sm:text-[2.125rem]">
        {piece.title}
      </h1>
      <p className="mt-2 max-w-[38rem] font-ui text-[1.0625rem] leading-relaxed text-ink-500">
        {piece.subtitle}
      </p>
    </div>
  </Link>
);

/**
 * A series' instalments, under its row. Number on the left, title, date on the
 * right — the same three fields the index itself uses, at a smaller size and
 * on lighter rules, so it reads as this row's contents rather than as five
 * more rows. The dates earn their place by showing the cadence the series
 * actually ran at; the numbers make the reading order explicit, which is the
 * one thing a series has that a list of blocks doesn't.
 */
export const PartsTable = ({
  parts,
  start = 1,
  nested = true,
}: {
  parts: SeriesPart[];
  /** The number to give the first row — the series page groups its parts
   *  under subheadings, and the numbering runs on across the groups. */
  start?: number;
  /**
   * Whether this list hangs under an index row or is a page's own content.
   * Both differences follow from it: nested, the dates are held off the column
   * edge and the titles sit a shade back, so the list reads as that row's
   * contents rather than as more rows. Standalone — the series' own page — the
   * table *is* the column, so an inset date wouldn't line up with the rule
   * above it and there's nothing left for the titles to defer to.
   */
  nested?: boolean;
}) => (
  <ol
    className={cn(
      "border-t border-ink-200/50",
      // Under a row's subtitle the list needs the full gap; under the series
      // page's 11px mono label it only needs to clear the caps.
      nested ? "mt-5" : "mt-3",
    )}
  >
    {parts.map((part, i) => (
      <li key={part.href}>
        <Link
          href={part.href}
          className="group/part flex items-baseline gap-3 border-b border-ink-200/50 py-2 sm:gap-4"
        >
          <span className="w-3 shrink-0 font-mono text-[0.6875rem] tabular-nums text-ink-400 transition-colors group-hover/part:text-indigo-700">
            {start + i}
          </span>
          <span
            className={cn(
              "min-w-0 flex-1 truncate font-ui text-[0.9375rem] transition-colors group-hover/part:text-indigo-700",
              nested ? "text-ink-500" : "text-ink-700",
            )}
          >
            {part.title}
          </span>
          <span
            className={cn(
              "shrink-0 font-ui text-xs tabular-nums tracking-[0.02em] text-ink-400",
              nested && "pr-3 sm:pr-6",
            )}
          >
            {formatMonth(part.published)}
          </span>
        </Link>
      </li>
    ))}
  </ol>
);

/**
 * One line of the index. Thumb on the right so every title shares a left edge.
 * The link wraps only the row itself — a series' parts hang below it as their
 * own links, which an anchor can't legally contain.
 */
export const PieceRow = ({ piece }: { piece: Piece }) => (
  <div className="border-b border-ink-200/70 py-7">
    <Link href={piece.href} className="group grid grid-cols-[1fr_auto] items-start gap-5 sm:gap-8">
      <div className="min-w-0">
        <Meta piece={piece} />
        <h2 className="mt-1.5 font-title text-xl leading-snug text-ink-900 transition-colors group-hover:text-indigo-700 sm:text-[1.375rem]">
          {piece.title}
        </h2>
        <p className="mt-1.5 font-ui text-[0.9375rem] leading-relaxed text-ink-500">
          {piece.subtitle}
        </p>
      </div>
      <div className="relative aspect-[16/9] w-28 shrink-0 overflow-hidden rounded bg-white ring-1 ring-ink-200/70 sm:w-40">
        <Cover
          piece={piece}
          src={piece.cover}
          sizes="(min-width: 640px) 160px, 112px"
          zoom="group-hover:scale-[1.04]"
        />
      </div>
    </Link>
    {piece.parts ? <PartsTable parts={piece.parts} /> : null}
  </div>
);

/**
 * One line of the archive: title and date, no cover and no subtitle. It's the
 * same link stripped to what you'd need to find something you already know
 * about — and it darkens on hover instead of turning indigo, so the list reads
 * as a footnote to the index rather than more of it.
 */
export const ArchiveRow = ({ piece }: { piece: Piece }) => (
  <Link
    href={piece.href}
    className="group flex items-baseline justify-between gap-4 border-b border-ink-200/70 py-3"
  >
    <span className="font-title text-base leading-snug text-ink-600 transition-colors group-hover:text-ink-900 sm:text-lg">
      {piece.title}
    </span>
    <span className="shrink-0 font-ui text-xs tabular-nums tracking-[0.02em] text-ink-400">
      {formatMonth(piece.published)}
    </span>
  </Link>
);

/* ------------------------------------------------------------------ *
 * Legacy — the previous homepage's poster-card set. Nothing renders
 * these now; kept on disk in case the card treatment is wanted again.
 * ------------------------------------------------------------------ */

interface TopicCardProps {
  href: string;
  imageSrc: string;
  title: string;
  darkText?: boolean;
  className?: string;
  withTitleBlur?: boolean;
}

interface TopicHeaderProps {
  children: React.ReactNode;
}

interface EdgelessScrollContainerProps {
  children: React.ReactNode;
}

interface TopicCardContainerProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const TopicHeader: React.FC<TopicHeaderProps> = ({ children }) => {
  return (
    <h1 className="text-2xl sm:text-3xl font-semibold text-ink-800 mb-4 sm:mb-6">
      {children}
    </h1>
  );
};

export const TopicCard: React.FC<TopicCardProps> = ({
  href,
  imageSrc,
  title,
  darkText = false,
  className = "",
  withTitleBlur = false,
}) => {
  const textColor = darkText ? "text-ink-800" : "text-white";

  return (
    <Link
      href={href}
      className={cn("mr-4 snap-start flex-shrink-0", className)}
    >
      <div className="relative aspect-[3/4] h-[300px] lg:h-[350px] overflow-hidden rounded-md shadow-md hover:shadow-lg transition-all duration-300 ease-in-out group">
        <Image
          src={imageSrc}
          fill
          sizes="(min-width: 1024px) 263px, 225px"
          className="transition-transform duration-300 ease-in-out group-hover:scale-105 object-cover"
          alt={title}
        />
        {withTitleBlur && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        )}
        <div>
          <h3
            className={`absolute bottom-4 left-4 text-lg font-semibold ${textColor}`}
          >
            {title}
          </h3>
        </div>
      </div>
    </Link>
  );
};

export const EdgelessScrollContainer: React.FC<
  EdgelessScrollContainerProps
> = ({ children }) => {
  return (
    <div className="w-full max-container">
      <div
        className="flex w-[var(--document-width)]"
        style={{
          marginLeft: "calc(-1 * var(--gutter-size)",
        }}
      >
        <div className="flex scroll-px-[var(--gutter-size)] min-w-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory no-scrollbar relative">
          <div className="shrink-0 w-[var(--gutter-size)]"></div>
          {children}
          <div className="shrink-0 w-[var(--gutter-size)]"></div>
        </div>
      </div>
    </div>
  );
};

export const TopicCardContainer: React.FC<TopicCardContainerProps> = ({
  title,
  children,
  className = "",
}) => {
  return (
    <div className={cn("overflow-hidden mb-14 sm:mb-20", className)}>
      <div className="max-container">
        <TopicHeader>{title}</TopicHeader>
      </div>
      <EdgelessScrollContainer>{children}</EdgelessScrollContainer>
    </div>
  );
};

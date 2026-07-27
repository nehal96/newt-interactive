import Link from "next/link";
import Image from "next/image";
import { cn } from "../../lib/utils";
import CoverArt from "../CoverArt";
import {
  KIND_LABEL,
  formatMonth,
  thumbFor,
  type Piece,
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
  /** Which captured file to use, when the piece has one rather than a motif. */
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

const KindAndDate = ({ piece }: { piece: Piece }) => (
  <p className="text-xs uppercase tracking-[0.13em] text-slate-400">
    {KIND_LABEL[piece.kind]}
    {/* The part count is the first thing to go when the line would wrap. */}
    {piece.parts ? (
      <span className="hidden sm:inline">{` · ${piece.parts} parts`}</span>
    ) : null}
    <span className="mx-1.5 text-slate-300">·</span>
    {formatMonth(piece.published)}
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
    {/* Pulled in on desktop — at the full 46rem the cover overwhelmed the
        title under it. Still flush left, so it shares the column's edge. */}
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded bg-white ring-1 ring-slate-200/70 sm:w-[85%]">
      <Cover
        piece={piece}
        src={piece.cover}
        priority
        sizes="(min-width: 768px) 39rem, 100vw"
        zoom="group-hover:scale-[1.02]"
      />
    </div>
    <div className="mt-5">
      <KindAndDate piece={piece} />
      <h2 className="mt-2 font-title text-3xl leading-tight text-slate-900 transition-colors group-hover:text-[color:var(--accent)] sm:text-[2.125rem]">
        {piece.title}
      </h2>
      <p className="mt-2 max-w-[38rem] text-[1.0625rem] leading-relaxed text-slate-500">
        {piece.subtitle}
      </p>
    </div>
  </Link>
);

/** One line of the index. Thumb on the right so every title shares a left edge. */
export const PieceRow = ({ piece }: { piece: Piece }) => (
  <Link
    href={piece.href}
    className="group grid grid-cols-[1fr_auto] items-start gap-5 border-b border-slate-200/70 py-7 sm:gap-8"
  >
    <div className="min-w-0">
      <KindAndDate piece={piece} />
      <h3 className="mt-1.5 font-title text-xl leading-snug text-slate-900 transition-colors group-hover:text-indigo-700 sm:text-[1.375rem]">
        {piece.title}
      </h3>
      <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-slate-500">
        {piece.subtitle}
      </p>
    </div>
    <div className="relative aspect-[16/9] w-28 shrink-0 overflow-hidden rounded bg-white ring-1 ring-slate-200/70 sm:w-40">
      <Cover
        piece={piece}
        src={thumbFor(piece)}
        sizes="(min-width: 640px) 160px, 112px"
        zoom="group-hover:scale-[1.04]"
      />
    </div>
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
    <h1 className="text-2xl sm:text-3xl font-semibold text-slate-800 mb-4 sm:mb-6">
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
  const textColor = darkText ? "text-slate-800" : "text-white";

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

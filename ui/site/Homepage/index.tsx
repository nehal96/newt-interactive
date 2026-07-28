import Link from "next/link";
import Image from "next/image";
import { cn } from "@lib/utils";
import CoverArt from "../CoverArt";
import {
  KIND_LABEL,
  formatMonth,
  type Piece,
  type SeriesPart,
} from "@lib/content";

const DEFAULT_ACCENT = "#4338ca";

const DATE_CLASS = "font-ui text-xs tabular-nums tracking-[0.02em] text-ink-400";

const Cover = ({
  piece,
  sizes,
  priority,
  zoom,
}: {
  piece: Piece;
  sizes: string;
  priority?: boolean;
  zoom: string;
}) => {
  const grow = cn("transition-transform duration-500 ease-out", zoom);

  return piece.art ? (
    <CoverArt motif={piece.art} className={cn("h-full w-full", grow)} />
  ) : (
    <Image
      src={piece.cover}
      alt=""
      fill
      priority={priority}
      sizes={sizes}
      className={cn("object-cover", grow)}
    />
  );
};

const accentVar = (piece: Piece) =>
  ({ "--accent": piece.accent ?? DEFAULT_ACCENT } as React.CSSProperties);

const Meta = ({ piece }: { piece: Piece }) => (
  <p className="flex flex-wrap items-baseline gap-x-4 gap-y-1 font-ui text-xs">
    <span className="font-mono text-[0.6875rem] uppercase tracking-[0.09em] text-ink-500">
      {KIND_LABEL[piece.kind]}
    </span>
    {piece.parts ? (
      <span className="hidden tabular-nums tracking-[0.02em] text-ink-400 sm:inline">
        {piece.parts.length} parts
      </span>
    ) : null}
    <span className={DATE_CLASS}>{formatMonth(piece.published)}</span>
  </p>
);

export const FeaturedPiece = ({ piece }: { piece: Piece }) => (
  <Link href={piece.href} className="group block" style={accentVar(piece)}>
    <div className="relative aspect-[16/9] max-h-[18.5rem] w-full overflow-hidden rounded bg-white ring-1 ring-ink-200/70">
      <Cover
        piece={piece}
        priority
        sizes="(min-width: 768px) 46rem, 100vw"
        zoom="group-hover:scale-[1.02]"
      />
    </div>
    <div className="mt-5">
      <Meta piece={piece} />
      <h2 className="mt-2 font-title text-3xl leading-tight text-ink-900 transition-colors group-hover:text-[color:var(--accent)] sm:text-[2.125rem]">
        {piece.title}
      </h2>
      <p className="mt-2 max-w-[38rem] font-ui text-[1.0625rem] leading-relaxed text-ink-500">
        {piece.subtitle}
      </p>
    </div>
  </Link>
);

export const PartsTable = ({
  parts,
  start = 1,
  nested = true,
}: {
  parts: SeriesPart[];
  start?: number;
  nested?: boolean;
}) => (
  <ol className={cn("border-t border-ink-200/50", nested ? "mt-5" : "mt-3")}>
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
            className={cn("shrink-0", DATE_CLASS, nested && "pr-3 sm:pr-6")}
          >
            {formatMonth(part.published)}
          </span>
        </Link>
      </li>
    ))}
  </ol>
);

export const PieceRow = ({ piece }: { piece: Piece }) => (
  <div className="border-b border-ink-200/70 py-7">
    <Link
      href={piece.href}
      className="group grid grid-cols-[1fr_auto] items-start gap-5 sm:gap-8"
      style={accentVar(piece)}
    >
      <div className="min-w-0">
        <Meta piece={piece} />
        <h2 className="mt-1.5 font-title text-xl leading-snug text-ink-900 transition-colors group-hover:text-[color:var(--accent)] sm:text-[1.375rem]">
          {piece.title}
        </h2>
        <p className="mt-1.5 font-ui text-[0.9375rem] leading-relaxed text-ink-500">
          {piece.subtitle}
        </p>
      </div>
      <div className="relative aspect-[16/9] w-28 shrink-0 overflow-hidden rounded bg-white ring-1 ring-ink-200/70 sm:w-40">
        <Cover
          piece={piece}
          sizes="(min-width: 640px) 160px, 112px"
          zoom="group-hover:scale-[1.04]"
        />
      </div>
    </Link>
    {/* Outside the Link — an anchor can't contain the parts' own anchors. */}
    {piece.parts ? <PartsTable parts={piece.parts} /> : null}
  </div>
);

export const ArchiveRow = ({ piece }: { piece: Piece }) => (
  <Link
    href={piece.href}
    className="group flex items-baseline justify-between gap-4 border-b border-ink-200/70 py-3"
  >
    <span className="font-title text-base leading-snug text-ink-600 transition-colors group-hover:text-ink-900 sm:text-lg">
      {piece.title}
    </span>
    <span className={cn("shrink-0", DATE_CLASS)}>
      {formatMonth(piece.published)}
    </span>
  </Link>
);

/* The previous homepage's poster-card set, kept on disk. */

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

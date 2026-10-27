// Figure frames: the titled card, Plate, Wrap and Note.
import { useId, type ReactNode } from "react";
import { cn } from "@lib/utils";

export default function Figure({
  title,
  subtitle,
  caption,
  side = false,
  slim = false,
  children,
}: {
  /** Float right of the prose on wide screens; the prose must sit in a <Wrap>. */
  side?: boolean;
  slim?: boolean;
  title: ReactNode;
  subtitle?: ReactNode;
  caption?: ReactNode;
  children: ReactNode;
}) {
  const titleId = useId();

  return (
    <figure
      aria-labelledby={titleId}
      className={cn(
        "my-10 w-full max-w-prose self-center rounded-xl bg-card px-4 py-5 sm:px-6 sm:py-6 lg:my-14",
        side && (slim ? "md:w-[16rem]" : "md:w-[20rem]"),
        side &&
          "md:float-right md:clear-right md:mb-6 md:ml-8 md:mt-1.5 md:px-4 md:py-4 lg:my-0 lg:mb-6",
      )}
    >
      <div className="mb-5">
        <p
          id={titleId}
          className="font-ui text-[0.9375rem] font-semibold leading-snug text-ink-900"
        >
          {title}
        </p>
        {subtitle && (
          <p className="mt-1 font-ui text-[0.8125rem] leading-normal text-ink-500">
            {subtitle}
          </p>
        )}
      </div>

      {children}

      {caption && (
        <figcaption className="mt-4 font-ui text-[0.6875rem] leading-4 text-ink-400">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/** A figure reproduced from a paper: straight on the page, no card, captioned below. */
export function Plate({
  title,
  subtitle,
  caption,
  children,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  caption?: ReactNode;
  children: ReactNode;
}) {
  return (
    <figure className="my-10 w-full max-w-prose self-center lg:my-14">
      {children}
      <figcaption className="mt-3 font-ui text-[0.8125rem] leading-normal text-ink-500">
        <span className="font-semibold text-ink-800">{title}.</span> {subtitle}
        {caption && <span className="mt-1 block text-[0.6875rem] leading-4 text-ink-400">{caption}</span>}
      </figcaption>
    </figure>
  );
}

/** A run of prose that a `side` figure can float into. */
export function Wrap({ children }: { children: ReactNode }) {
  return (
    <div className="flow-root w-full max-w-prose self-center">{children}</div>
  );
}

/** A panel heading and its one "what to notice" sentence. */
export function Note({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-1">
      <p className="font-ui text-xs font-semibold text-ink-800">{title}</p>
      <p className="mt-0.5 font-ui text-xs leading-[1.125rem] text-ink-600">{children}</p>
    </div>
  );
}

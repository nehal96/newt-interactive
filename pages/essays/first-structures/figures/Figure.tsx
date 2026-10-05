// A titled figure; given several <Variant>s, a toggle picks which one shows.
import {
  Children,
  isValidElement,
  useId,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { Tabs, TabsList, TabsTrigger } from "@ui/controls";
import { cn } from "@lib/utils";

type VariantProps = {
  name: string;
  label?: string;
  subtitle?: ReactNode;
  children: ReactNode;
};

const LABEL: Record<string, string> = {
  static: "Static",
  interactive: "Interactive",
};

/** Read by <Figure>, never rendered itself. The first listed shows first. */
export function Variant(_: VariantProps) {
  return null;
}

export default function Figure({
  title,
  subtitle,
  caption,
  side = false,
  slim = false,
  drop,
  children,
}: {
  /** Float right of the prose on wide screens; the prose must sit in a <Wrap>. */
  side?: boolean;
  /** How far down the prose a side figure starts, as a CSS length. */
  drop?: string;
  slim?: boolean;
  title: ReactNode;
  subtitle?: ReactNode;
  caption?: ReactNode;
  children: ReactNode;
}) {
  const titleId = useId();
  const variants = Children.toArray(children).filter(
    (child): child is ReactElement<VariantProps> =>
      isValidElement(child) && child.type === Variant,
  );
  const [active, setActive] = useState(variants[0]?.props.name);
  const current = variants.find((v) => v.props.name === active) ?? variants[0];
  const shownSubtitle = current?.props.subtitle ?? subtitle;

  return (
    <>
      {side && drop && (
        <div
          aria-hidden
          className="hidden w-0 md:float-right md:block"
          style={{ height: drop }}
        />
      )}
      <figure
        aria-labelledby={titleId}
        className={cn(
          "my-10 w-full max-w-prose self-center rounded-xl bg-card px-4 py-5 sm:px-6 sm:py-6 lg:my-14",
          side && (slim ? "md:w-[16rem]" : "md:w-[20rem]"),
          side &&
            "md:float-right md:clear-right md:mb-6 md:ml-8 md:mt-1.5 md:px-4 md:py-4 lg:my-0 lg:mb-6",
        )}
      >
        <div className="mb-5 flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
          <div className="min-w-0 flex-1 basis-72">
            <p
              id={titleId}
              className="font-ui text-[0.9375rem] font-semibold leading-snug text-ink-900"
            >
              {title}
            </p>
            {shownSubtitle && (
              <p className="mt-1 font-ui text-[0.8125rem] leading-normal text-ink-500">
                {shownSubtitle}
              </p>
            )}
          </div>
          {variants.length > 1 && (
            <Tabs value={active} onValueChange={setActive}>
              <TabsList className="h-8 bg-ink-200/60 p-0.5">
                {variants.map((v) => (
                  <TabsTrigger
                    key={v.props.name}
                    value={v.props.name}
                    className="px-2.5 py-1 font-ui text-xs text-ink-500 hover:bg-transparent data-[state=active]:bg-paper data-[state=active]:text-ink-900"
                  >
                    {v.props.label ?? LABEL[v.props.name] ?? v.props.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          )}
        </div>

        {current ? current.props.children : children}

        {caption && (
          <figcaption className="mt-4 font-ui text-[0.6875rem] leading-4 text-ink-400">
            {caption}
          </figcaption>
        )}
      </figure>
    </>
  );
}

/** A run of prose that a `side` figure can float into. */
export function Wrap({ children }: { children: ReactNode }) {
  return (
    <div className="flow-root w-full max-w-prose self-center">{children}</div>
  );
}

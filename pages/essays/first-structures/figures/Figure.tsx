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
  children,
}: {
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
    <figure
      aria-labelledby={titleId}
      className="my-10 w-full max-w-prose self-center lg:my-14"
    >
      <div className="mb-5 flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
        <div className="min-w-0 flex-1 basis-72">
          <p
            id={titleId}
            className="font-ui text-[1.0625rem] font-semibold leading-snug text-ink-900"
          >
            {title}
          </p>
          {shownSubtitle && (
            <p className="mt-1.5 font-ui text-[0.9375rem] leading-normal text-ink-500">
              {shownSubtitle}
            </p>
          )}
        </div>
        {variants.length > 1 && (
          <Tabs
            value={active}
            onValueChange={setActive}
          >
            <TabsList className="h-8 bg-ink-100 p-0.5">
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
        <figcaption className="mt-4 font-ui text-[0.8125rem] leading-5 text-ink-500">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

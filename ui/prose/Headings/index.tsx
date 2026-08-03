import {
  DetailedHTMLProps,
  FunctionComponent,
  HTMLAttributes,
  ReactNode,
  isValidElement,
} from "react";
import { cn, slugify } from "@lib/utils";

type HeadingProps = DetailedHTMLProps<
  HTMLAttributes<HTMLHeadingElement>,
  HTMLHeadingElement
>;

const textOf = (node: ReactNode): string => {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement(node))
    return textOf((node.props as { children?: ReactNode }).children);
  return "";
};

/** Rendered on the server so a `#section` link resolves before hydration. */
const anchorId = (id: string | undefined, children: ReactNode) =>
  id ?? (slugify(textOf(children)) || undefined);

const H2: FunctionComponent<HeadingProps> = ({ children, className, id }) => {
  return (
    <h2
      id={anchorId(id, children)}
      className={cn(
        "font-body font-medium text-xl w-full text-ink-800 self-center max-w-prose mb-8 md:text-2xl md:tracking-wide",
        className
      )}
    >
      {children}
    </h2>
  );
};

const H3: FunctionComponent<HeadingProps> = ({ children, className, id }) => {
  return (
    <h3
      id={anchorId(id, children)}
      className={cn(
        "font-body font-medium text-lg w-full text-ink-800 self-center max-w-prose mb-8 mt-4 md:text-xl md:tracking-wide",
        className
      )}
    >
      {children}
    </h3>
  );
};

export { H2, H3 };

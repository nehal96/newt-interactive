import { DetailedHTMLProps, FunctionComponent, HTMLAttributes } from "react";
import { cn } from "@lib/utils";

const H2: FunctionComponent<
  DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>
> = ({ children, className }) => {
  return (
    <h2
      className={cn(
        "font-body font-medium text-xl w-full text-ink-800 self-center max-w-prose mb-8 md:text-2xl md:tracking-wide",
        className
      )}
    >
      {children}
    </h2>
  );
};

const H3: FunctionComponent<
  DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>
> = ({ children, className }) => {
  return (
    <h3
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

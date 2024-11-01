import { DetailedHTMLProps, HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

interface ParagraphProps
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLParagraphElement>,
    HTMLParagraphElement
  > {}

const Paragraph = ({ children, className }: ParagraphProps) => {
  return (
    <p
      className={cn(
        "font-body text-base w-full text-slate-700 self-center max-w-prose mb-5 md:mb-8 md:text-lg md:tracking-wide",
        className
      )}
    >
      {children}
    </p>
  );
};

export default Paragraph;

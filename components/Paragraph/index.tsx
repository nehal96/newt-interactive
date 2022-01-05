import { DetailedHTMLProps, HTMLAttributes } from "react";

interface ParagraphProps
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLParagraphElement>,
    HTMLParagraphElement
  > {}

const Paragraph = ({ children, className }: ParagraphProps) => {
  return (
    <p
      className={`font-body text-lg w-full text-slate-700 self-center max-w-3xl mb-8 md:text-xl md:tracking-wide ${className}`}
    >
      {children}
    </p>
  );
};

export default Paragraph;

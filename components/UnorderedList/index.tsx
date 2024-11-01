import { DetailedHTMLProps, HTMLAttributes } from "react";
import styles from "./ul.module.css";
import { cn } from "../../lib/utils";

interface ULProps
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLUListElement>,
    HTMLUListElement
  > {}

const UnorderedList = ({ children, className, ...props }: ULProps) => {
  return (
    <ul
      className={cn(
        "font-body text-lg w-full text-slate-700 self-center list-disc list-outside max-w-3xl mb-8 md:text-xl md:tracking-wide",
        styles.ul,
        className
      )}
      {...props}
    >
      {children}
    </ul>
  );
};

export default UnorderedList;

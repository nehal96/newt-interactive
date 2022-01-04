import { DetailedHTMLProps, HTMLAttributes } from "react";
import { CodeVariant, getStyles } from "./helpers";

interface CodeProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLPreElement>, HTMLPreElement> {
  variant?: CodeVariant;
}

const Code = ({ children, variant, className, ...props }: CodeProps) => {
  return (
    <pre
      className={`p-4 rounded-md overflow-auto ${getStyles(
        variant
      )} ${className}`}
      {...props}
    >
      <code>{children}</code>
    </pre>
  );
};

export default Code;

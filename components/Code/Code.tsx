import {
  DetailedHTMLProps,
  FunctionComponent,
  HTMLAttributes,
  useEffect,
} from "react";
import Prism from "prismjs";
import "prismjs/components/prism-jsx.min";
import "prismjs/components/prism-python.min";
import { CodeVariant, getStyles } from "./helpers";

type CodeProps = DetailedHTMLProps<
  HTMLAttributes<HTMLPreElement>,
  HTMLPreElement
> &
  (
    | {
        withSyntaxHighlighting?: true;
        language: string;
        variant?: never;
      }
    | {
        withSyntaxHighlighting: false;
        variant: CodeVariant;
        language?: never;
      }
  );

const Code: FunctionComponent<CodeProps> = ({
  children,
  withSyntaxHighlighting = true,
  language,
  variant,
  className,
  ...props
}) => {
  useEffect(() => {
    if (withSyntaxHighlighting) {
      Prism.highlightAll();
    }
  }, [children, language]);

  return (
    <pre
      className={`p-4 rounded-md overflow-auto ${className} ${
        !withSyntaxHighlighting ? getStyles(variant) : ""
      }`}
      {...props}
    >
      <code className={withSyntaxHighlighting ? `language-${language}` : null}>
        {children}
      </code>
    </pre>
  );
};

export default Code;

import { useMemo } from "react";
import katex from "katex";
import { cn } from "@lib/utils";
import "katex/dist/katex.min.css";

interface MathFormulaProps {
  tex: string;
  variant?: "regular" | "small";
  className?: string;
}

const MathFormula = ({
  tex,
  variant = "regular",
  className,
}: MathFormulaProps) => {
  // Rendering here rather than in an effect keeps the formula in the server
  // HTML; KaTeX output is deterministic, so it hydrates clean.
  const __html = useMemo(
    () => katex.renderToString(tex, { throwOnError: false }),
    [tex]
  );

  return (
    <span
      className={cn(variant === "small" ? "text-sm" : "text-base", className)}
      dangerouslySetInnerHTML={{ __html }}
    />
  );
};

export default MathFormula;

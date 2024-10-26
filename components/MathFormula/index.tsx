import TeX from "@matejmazur/react-katex";
import { cn } from "../../lib/utils";
import "katex/dist/katex.min.css";

interface MathFormulaProps {
  tex: string;
  variant?: "regular" | "tutorial" | "popover";
  className?: string;
}

const MathFormula = ({
  tex,
  variant = "regular",
  className,
  ...props
}: MathFormulaProps) => {
  const getClassByVariant = () => {
    if (variant === "tutorial") return "text-base";
    if (variant === "popover") return "text-sm";
    return "text-base md:text-lg";
  };

  return (
    <TeX math={tex} className={cn(getClassByVariant(), className)} {...props} />
  );
};

export default MathFormula;

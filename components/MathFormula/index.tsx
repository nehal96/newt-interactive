import TeX from "@matejmazur/react-katex";
import { cn } from "../../lib/utils";
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
  ...props
}: MathFormulaProps) => {
  const getClassByVariant = () => {
    if (variant === "small") return "text-sm";
    return "text-base";
  };

  return (
    <TeX math={tex} className={cn(getClassByVariant(), className)} {...props} />
  );
};

export default MathFormula;

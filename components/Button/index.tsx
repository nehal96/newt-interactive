import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { cn } from "../../lib/utils";

interface ButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  variant: "primary" | "secondary" | "outline" | "ghost";
}

const Button = ({ variant, children, className, ...props }: ButtonProps) => {
  const getButtonStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-ink-800 hover:bg-ink-900 text-ink-100 disabled:opacity-60 disabled:hover:bg-ink-800 disabled:cursor-not-allowed";
      case "secondary":
        return "bg-ink-200 hover:bg-ink-300 text-ink-800 disabled:opacity-60 disabled:text-ink-500 disabled:bg-ink-200 disabled:cursor-not-allowed";
      case "outline":
        return "border border-ink-300 hover:border-ink-400";
      case "ghost":
        return "text-ink-600 hover:text-ink-800 hover:bg-ink-100";
      default:
        return "text-ink-800";
    }
  };

  return (
    <button
      className={cn(
        "py-1 px-2 rounded-md transition-colors",
        getButtonStyles(),
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

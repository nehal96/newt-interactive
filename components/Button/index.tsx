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
        return "bg-slate-800 hover:bg-slate-900 text-slate-50 disabled:opacity-60 disabled:hover:bg-slate-800 disabled:cursor-not-allowed";
      case "secondary":
        return "bg-slate-200 hover:bg-slate-300 text-slate-800 disabled:opacity-60 disabled:text-slate-500 disabled:bg-slate-200 disabled:cursor-not-allowed";
      case "outline":
        return "border border-slate-300 hover:border-slate-400";
      case "ghost":
        return "text-slate-600 hover:text-slate-800 hover:bg-slate-100";
      default:
        return "text-slate-800";
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

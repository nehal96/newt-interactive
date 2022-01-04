import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

interface ButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  variant: "primary" | "secondary" | "outline";
}

const Button = ({ variant, children, className, ...props }: ButtonProps) => {
  const getButtonStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-slate-700 hover:bg-slate-800 text-slate-50";
      case "secondary":
        return "bg-slate-200 hover:bg-slate-300 text-slate-800";
      case "outline":
        return "border border-slate-300 hover:border-slate-400";
      default:
        return "text-slate-800";
    }
  };
  return (
    <button
      className={`py-1 px-2 rounded-md ${getButtonStyles()} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

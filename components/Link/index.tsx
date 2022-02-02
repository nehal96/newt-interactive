import { AnchorHTMLAttributes, DetailedHTMLProps } from "react";

interface LinkProps
  extends DetailedHTMLProps<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  > {
  toNewTab?: boolean;
}

const Link = ({ children, toNewTab, ...props }: LinkProps) => {
  return (
    <a
      className="text-slate-800 hover:text-slate-900 underline underline-offset-1 decoration-slate-700"
      target={toNewTab ? "_blank" : "_self"}
      rel={toNewTab ? "noreferrer noopener" : null}
      {...props}
    >
      {children}
    </a>
  );
};

export default Link;

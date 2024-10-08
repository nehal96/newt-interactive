import { DetailedHTMLProps, FunctionComponent, HTMLAttributes } from "react";

const Subheader: FunctionComponent<
  DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>
> = ({ children, className }) => {
  return (
    <h3
      className={`font-body font-medium text-xl w-full text-slate-800 self-center max-w-3xl mb-8 md:text-2xl md:tracking-wide ${className}`}
    >
      {children}
    </h3>
  );
};

export default Subheader;

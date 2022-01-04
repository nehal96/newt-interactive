import { DetailedHTMLProps, FunctionComponent, HTMLAttributes } from "react";

export const InteractiveTutorialContainer: FunctionComponent = ({
  children,
}) => {
  return (
    <div className="flex flex-col-reverse w-full my-8 mx-auto justify-center lg:flex-row lg:my-12">
      {children}
    </div>
  );
};

export const InteractiveContainer: FunctionComponent<
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ children, className = "lg:w-2/5", ...props }) => {
  return (
    <div
      className={`flex justify-center mx-0 my-4 md:mx-4 lg:my-0 ${className}`}
      {...props}
    >
      <div className="flex flex-col justify-center w-full">{children}</div>
    </div>
  );
};

export const TextContainer: FunctionComponent<
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ children, className = "lg:w-3/5", ...props }) => {
  return (
    <div
      className={`flex flex-col justify-start p-6 mx-0 my-4 border border-slate-300 bg-slate-50 rounded-xl md:mx-4 lg:my-0 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

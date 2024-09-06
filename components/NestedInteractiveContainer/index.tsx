import { DetailedHTMLProps, FunctionComponent, HTMLAttributes } from "react";

export const NestedInteractiveContainer: FunctionComponent<
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ children, className }) => {
  return (
    <div
      className={`flex flex-col-reverse w-full min-w-[350px] my-8 mx-auto justify-center lg:flex-row lg:my-12 bg-slate-100/60 backdrop-blur-3xl rounded-lg shadow-lg p-6 lg:p-8 ${className}`}
    >
      {children}
    </div>
  );
};

export const NestedInteractiveTextContainer: FunctionComponent<
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ children, className }) => {
  return (
    <div className={`w-full mt-8 pr-4 lg:mt-0 lg:w-1/2 ${className}`}>
      {children}
    </div>
  );
};

export const NestedInteractiveCanvasContainer: FunctionComponent<
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ children, className }) => {
  return (
    <div className={`w-full lg:w-1/2 rounded-lg ${className}`}>{children}</div>
  );
};

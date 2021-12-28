import { DetailedHTMLProps, FunctionComponent, HTMLAttributes } from "react";

export const InteractiveTutorialContainer: FunctionComponent = ({
  children,
}) => {
  return (
    <div className="flex flex-col w-full my-8 mx-auto justify-center lg:flex-row lg:my-12">
      {children}
    </div>
  );
};

export const InteractiveContainer: FunctionComponent = ({ children }) => {
  return (
    <div className="flex justify-center m-4 lg:my-0 lg:w-2/5">
      <div className="flex flex-col justify-center">{children}</div>
    </div>
  );
};

export const TextContainer: FunctionComponent<
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ children, ...props }) => {
  return (
    <div
      className="flex flex-col justify-start p-6 m-4 border border-slate-300 bg-slate-50 rounded-xl lg:my-0 lg:w-3/5"
      {...props}
    >
      {children}
    </div>
  );
};

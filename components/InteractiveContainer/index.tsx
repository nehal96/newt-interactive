import { DetailedHTMLProps, FunctionComponent, HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export const InteractiveTutorialContainer: FunctionComponent<
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        "flex flex-col-reverse w-full mx-auto justify-center lg:flex-row",
        className
      )}
      {...props}
    >
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
      <div className="flex flex-col justify-center w-full max-w-[550px]">
        {children}
      </div>
    </div>
  );
};

export const TextContainer: FunctionComponent<
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ children, className = "lg:w-3/5", ...props }) => {
  return (
    <div
      className={cn(
        "flex flex-col justify-start p-5 md:p-6 mx-0 my-2 bg-slate-50 rounded-xl md:mx-4 lg:my-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

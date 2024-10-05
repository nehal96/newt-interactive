import Tippy, { TippyProps } from "@tippyjs/react";
import { ReactNode, useState } from "react";
import "tippy.js/dist/tippy.css";

interface TooltipProps extends Omit<TippyProps, "children"> {
  children?: React.ReactNode;
  content: ReactNode;
  highlightColor?: string;
}

interface TooltipContentProps {
  children: React.ReactNode;
}

export const TooltipContent = ({ children }: TooltipContentProps) => {
  return <div className="p-2">{children}</div>;
};

const Tooltip = ({
  children,
  content,
  interactive = true,
  interactiveBorder = 20,
  highlightColor = "newt-blue-50",
  ...props
}: TooltipProps) => {
  const [isShown, setIsShown] = useState(false);

  return (
    <>
      <span className={isShown ? `bg-${highlightColor}` : null}>
        {children}
      </span>
      <Tippy
        content={content}
        interactive={interactive}
        interactiveBorder={interactiveBorder}
        onShow={() => setIsShown(true)}
        onHide={() => setIsShown(false)}
        {...props}
      >
        <span className="relative bg-newt-blue-100 px-1.5 text-xs font-medium rounded-full ml-0.5 -top-2">
          i
        </span>
      </Tippy>
    </>
  );
};

export default Tooltip;

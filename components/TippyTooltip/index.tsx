import Tippy, { TippyProps } from "@tippyjs/react";
import { ReactNode, useState } from "react";
import "tippy.js/dist/tippy.css";

type HighlightColorType =
  | "newt-blue-50"
  | "newt-blue-100"
  | "slate-50"
  | "slate-100"
  | "indigo-50"
  | "indigo-100";

interface TippyTooltipProps extends Omit<TippyProps, "children"> {
  children?: React.ReactNode;
  content: ReactNode;
  highlightColor?: HighlightColorType;
  iconColor?: HighlightColorType;
}

interface TippyTooltipContentProps {
  children: React.ReactNode;
}

export const TippyTooltipContent = ({ children }: TippyTooltipContentProps) => {
  return <div className="p-2">{children}</div>;
};

const TippyTooltip = ({
  children,
  content,
  interactive = true,
  interactiveBorder = 20,
  highlightColor = "newt-blue-50",
  iconColor = "newt-blue-100",
  ...props
}: TippyTooltipProps) => {
  const [isShown, setIsShown] = useState(false);

  return (
    <>
      <span className={isShown ? `bg-${highlightColor}` : ""}>{children}</span>
      <Tippy
        content={content}
        interactive={interactive}
        interactiveBorder={interactiveBorder}
        onShow={() => setIsShown(true)}
        onHide={() => setIsShown(false)}
        {...props}
      >
        <span
          className={`relative bg-${iconColor} px-1.5 text-xs font-medium rounded-full ml-0.5 -top-2`}
        >
          i
        </span>
      </Tippy>
    </>
  );
};

export default TippyTooltip;

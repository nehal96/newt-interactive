import Tippy, { TippyProps } from "@tippyjs/react";
import { useState } from "react";
import "tippy.js/dist/tippy.css";

interface PopoverProps extends Omit<TippyProps, "children"> {
  children: React.ReactNode;
}
interface PopoverContentProps {
  children: React.ReactNode;
}

export const PopoverContent = ({ children }: PopoverContentProps) => {
  return <div className="p-2">{children}</div>;
};

const Popover = ({
  children,
  content,
  interactive = true,
  interactiveBorder = 20,
  ...props
}: PopoverProps) => {
  const [isShown, setIsShown] = useState(false);

  return (
    <>
      <span className={isShown ? "bg-newt-blue-50" : null}>{children}</span>
      <Tippy
        content={content}
        interactive={interactive}
        interactiveBorder={interactiveBorder}
        onShow={() => setIsShown(true)}
        onHide={() => setIsShown(false)}
        {...props}
      >
        <span className="relative bg-newt-blue-100 px-1.5 text-sm font-medium rounded-2xl -top-2 ml-1">
          i
        </span>
      </Tippy>
    </>
  );
};

export default Popover;

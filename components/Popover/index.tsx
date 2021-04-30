import Tippy, { TippyProps } from "@tippyjs/react";
import { useState } from "react";
import "tippy.js/dist/tippy.css";
import styles from "./popover.module.css";

interface PopoverProps extends Omit<TippyProps, "children"> {
  children: React.ReactNode;
}
interface PopoverContentProps {
  children: React.ReactNode;
}

export const PopoverContent = ({ children }: PopoverContentProps) => {
  return <div className={styles["popover-content"]}>{children}</div>;
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
      <span className={isShown ? styles.active : null}>{children}</span>
      <Tippy
        content={content}
        interactive={interactive}
        interactiveBorder={interactiveBorder}
        onShow={() => setIsShown(true)}
        onHide={() => setIsShown(false)}
        {...props}
      >
        <span className={styles["popover-btn"]}>i</span>
      </Tippy>
    </>
  );
};

export default Popover;

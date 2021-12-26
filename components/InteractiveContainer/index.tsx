import { DetailedHTMLProps, FunctionComponent, HTMLAttributes } from "react";
import styles from "./InteractiveContainer.module.css";

export const InteractiveTutorialContainer: FunctionComponent = ({
  children,
}) => {
  return <div className={styles.container}>{children}</div>;
};

export const InteractiveContainer: FunctionComponent = ({ children }) => {
  return (
    <div className={styles["interactive-container"]}>
      <div className={styles["interactive-container--inner"]}>{children}</div>
    </div>
  );
};

export const TextContainer: FunctionComponent<
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ children, ...props }) => {
  return (
    <div className={styles["text-container"]} {...props}>
      {children}
    </div>
  );
};

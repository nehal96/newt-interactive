import classnames from "classnames/bind";
import styles from "./input.module.css";

const cx = classnames.bind(styles);

interface InputPrependProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLSpanElement>,
    HTMLSpanElement
  > {
  isValid?: null | undefined | boolean;
}

const InputPrepend = ({ children, isValid }: InputPrependProps) => {
  return (
    <span
      className={cx(
        styles["prepend-text"],
        isValid === null || isValid === undefined
          ? null
          : isValid
          ? styles["prepend-text--valid"]
          : styles["prepend-text--invalid"]
      )}
    >
      {children}
    </span>
  );
};

export default InputPrepend;

import styles from "./input.module.css";
import classnames from "classnames/bind";

const cx = classnames.bind(styles);

interface InputProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  withPrepend?: boolean;
  isValid?: boolean | null | undefined;
}

const Input = ({
  withPrepend = false,
  isValid,
  className,
  ...props
}: InputProps) => {
  return (
    <input
      className={cx(
        styles.input,
        withPrepend ? styles["prepend-input"] : null,
        isValid === null || isValid === undefined
          ? null
          : isValid
          ? styles["input--valid"]
          : styles["input--invalid"],
        className
      )}
      {...props}
    />
  );
};

export default Input;

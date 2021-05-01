import styles from "./input.module.css";
import classnames from "classnames/bind";

const cx = classnames.bind(styles);

interface InputProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  withPrepend?: boolean;
}

const Input = ({ withPrepend = false, className, ...props }: InputProps) => {
  return (
    <input
      className={cx(
        styles.input,
        withPrepend ? styles["prepend-input"] : null,
        className
      )}
      {...props}
    />
  );
};

export default Input;

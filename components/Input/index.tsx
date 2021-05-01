import styles from "./input.module.css";
import classnames from "classnames/bind";

const cx = classnames.bind(styles);

interface InputProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  withPrepend?: boolean;
  prependText?: string;
}

const Input = ({
  withPrepend = false,
  prependText,
  className,
  ...props
}: InputProps) => {
  return withPrepend ? (
    <div className={styles["prepend-group"]}>
      <span className={styles["prepend-text"]}>{prependText}</span>
      <input
        className={cx(styles.input, styles["prepend-input"], className)}
        {...props}
      />
    </div>
  ) : (
    <input className={cx(styles.input, className)} {...props} />
  );
};

export default Input;

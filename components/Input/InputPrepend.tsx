import styles from "./input.module.css";

interface InputPrependProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLSpanElement>,
    HTMLSpanElement
  > {}

const InputPrepend = ({ children }: InputPrependProps) => {
  return <span className={styles["prepend-text"]}>{children}</span>;
};

export default InputPrepend;

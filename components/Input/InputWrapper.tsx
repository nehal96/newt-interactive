import styles from "./input.module.css";

interface InputWrapperProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {}

const InputWrapper = ({ children }: InputWrapperProps) => {
  return <div className={styles.wrapper}>{children}</div>;
};

export default InputWrapper;

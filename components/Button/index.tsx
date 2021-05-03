import classnames from "classnames/bind";
import styles from "./button.module.css";

const cx = classnames.bind(styles);

type ButtonCategory = "primary" | "secondary" | "success" | "danger";

interface ButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  category?: ButtonCategory;
}

const Button = ({ children, category, disabled, ...props }: ButtonProps) => {
  return (
    <button
      className={cx("btn", {
        "btn--primary": category === "primary",
        "btn--disabled": disabled,
      })}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

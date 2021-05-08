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

const Button = ({
  children,
  category,
  disabled,
  onClick,
  ...props
}: ButtonProps) => {
  return (
    <button
      type="button"
      className={cx("btn", {
        "btn--primary": category === "primary",
        "btn--danger": category === "danger",
        "btn--disabled": disabled,
      })}
      onClick={disabled ? null : onClick} // Dunno why it doesn't do this by default
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

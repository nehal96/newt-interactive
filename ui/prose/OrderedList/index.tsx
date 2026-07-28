import { DetailedHTMLProps, OlHTMLAttributes } from "react";
import styles from "./ol.module.css";

interface ULProps
  extends DetailedHTMLProps<
    OlHTMLAttributes<HTMLOListElement>,
    HTMLOListElement
  > {}

const OrderedList = ({ children, ...props }: ULProps) => {
  return (
    <ol className={styles.ol} {...props}>
      {children}
    </ol>
  );
};

export default OrderedList;

import { DetailedHTMLProps, HTMLAttributes } from "react";
import styles from "./ul.module.css";

interface ULProps
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLUListElement>,
    HTMLUListElement
  > {}

const UnorderedList = ({ children }: ULProps) => {
  return <ul className={styles.ul}>{children}</ul>;
};

export default UnorderedList;

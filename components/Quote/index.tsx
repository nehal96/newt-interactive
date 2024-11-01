import { DetailedHTMLProps, HTMLAttributes } from "react";
import styles from "./quote.module.css";

interface QuoteProps
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLQuoteElement>,
    HTMLQuoteElement
  > {}

export default function Quote({ children }: QuoteProps) {
  return <blockquote className={styles.quote}>{children}</blockquote>;
}

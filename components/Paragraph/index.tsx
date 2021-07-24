import styles from "./Paragraph.module.css";

interface Paragraph {
  children: React.ReactNode;
}

const Paragraph = ({ children }: Paragraph) => {
  return <p className={styles.para}>{children}</p>;
};

export default Paragraph;

import styles from "./Lede.module.css";

interface Lede {
  children: React.ReactNode;
}

const Lede = ({ children }: Lede) => {
  return <h2 className={styles.lede}>{children}</h2>;
};

export default Lede;

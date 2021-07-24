import styles from "./Title.module.css";

interface Title {
  children: React.ReactNode;
}

const Title = ({ children }: Title) => {
  return <h1 className={styles.title}>{children}</h1>;
};

export default Title;

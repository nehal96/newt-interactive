import styles from "./ArticleContainer.module.css";

interface ArticleContainer {
  children: React.ReactNode;
}

const ArticleContainer = ({ children }: ArticleContainer) => {
  return <article className={styles.container}>{children}</article>;
};

export default ArticleContainer;

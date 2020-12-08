import styles from "./genetics.module.css";

const GeneticsPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles["interactive-container"]}>
        <div className={styles["interactive-container--inner"]}></div>
      </div>
      <div className={styles["text-container"]}>
        Welcome to genetics interactive
      </div>
    </div>
  );
};

export default GeneticsPage;

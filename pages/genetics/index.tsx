import dynamic from "next/dynamic";
import styles from "./genetics.module.css";

// Load r3f components like this to "solve" those can't import module 3js issues
const GeneticsComponent = dynamic(
  () => import("../../components/GeneticsComponent"),
  { ssr: false }
);

const GeneticsPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles["interactive-container"]}>
        <div className={styles["interactive-container--inner"]}>
          <GeneticsComponent />
        </div>
      </div>
      <div className={styles["text-container"]}>
        Welcome to genetics interactive
      </div>
    </div>
  );
};

export default GeneticsPage;

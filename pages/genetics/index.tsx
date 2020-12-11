import { Canvas } from "react-three-fiber";
import DNAModel from "./DNAModel";
import styles from "./genetics.module.css";

const GeneticsPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles["interactive-container"]}>
        <div className={styles["interactive-container--inner"]}>
          <Canvas
            camera={{ fov: 60, near: 0.1, far: 1000, position: [0, -35, 0] }}
          >
            <DNAModel />
          </Canvas>
        </div>
      </div>
      <div className={styles["text-container"]}>
        Welcome to genetics interactive
      </div>
    </div>
  );
};

export default GeneticsPage;

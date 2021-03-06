import dynamic from "next/dynamic";
import { useState } from "react";
import styles from "./genetics.module.css";

// Load r3f components like this to "solve" those can't import module 3js issues
const GeneticsComponent = dynamic(
  () => import("../../components/GeneticsComponent"),
  { ssr: false }
);

const GeneticsPage = () => {
  const [slide, setSlide] = useState(0);

  return (
    <div className={styles.container}>
      <div className={styles["interactive-container"]}>
        <div className={styles["interactive-container--inner"]}>
          <GeneticsComponent slide={slide} />
        </div>
      </div>
      <div className={styles["text-container"]}>
        Welcome to genetics interactive
        <button onClick={() => setSlide((slide) => slide + 1)}>Next</button>
        <button onClick={() => setSlide(0)}>Reset</button>
        <p>{`Slide ${slide}`}</p>
      </div>
    </div>
  );
};

export default GeneticsPage;

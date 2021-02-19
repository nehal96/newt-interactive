import dynamic from "next/dynamic";
import { useState } from "react";
import {
  ArticleContainer,
  Navbar,
  Title,
  Lede,
  Paragraph,
} from "../../components";
import styles from "./genetics.module.css";

// Load r3f components like this to "solve" those can't import module 3js issues
const GeneticsComponent = dynamic(
  () => import("../../components/GeneticsComponent"),
  { ssr: false }
);

const GeneticsPage = () => {
  const [slide, setSlide] = useState(0);

  return (
    <>
      <Navbar />
      <ArticleContainer>
        <Title>Discovering the Shape of Life</Title>
        <Lede>
          How a handful of scientists, spanning almost a century, discovered the
          structure of DNA. Gonna make this a bit longer to test
        </Lede>
        <Paragraph>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Quam
          quisque id diam vel. At tempor commodo ullamcorper a. Consectetur a
          erat nam at lectus urna duis convallis convallis. Quis commodo odio
          aenean sed. Porta nibh venenatis cras sed felis eget velit aliquet.
          Senectus et netus et malesuada fames ac turpis.
        </Paragraph>
        <Paragraph>
          Mauris pharetra et ultrices neque ornare. Commodo odio aenean sed
          adipiscing diam. A erat nam at lectus. Adipiscing at in tellus integer
          feugiat scelerisque varius morbi enim. Ornare arcu dui vivamus arcu
          felis. Vel pretium lectus quam id leo in vitae turpis massa. Odio ut
          enim blandit volutpat maecenas volutpat blandit.
        </Paragraph>
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
      </ArticleContainer>
    </>
  );
};

export default GeneticsPage;

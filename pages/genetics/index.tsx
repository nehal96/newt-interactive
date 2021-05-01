import dynamic from "next/dynamic";
import { useState } from "react";
import {
  ArticleContainer,
  Navbar,
  Title,
  Lede,
  Paragraph,
  Popover,
  PopoverContent,
  Footer,
} from "../../components";
import styles from "./genetics.module.css";

// Load r3f components like this to "solve" those can't import module 3js issues
const XRayCrystallographyGame = dynamic(
  () => import("../../canvases/XRayCrystallographyGame"),
  { ssr: false }
);
const DNADoubleHelixCanvas = dynamic(
  () => import("../../canvases/DNA-DoubleHelixCanvas"),
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
          <Popover content={<PopoverContent>loremmmmm</PopoverContent>}>
            Lorem ipsum
          </Popover>{" "}
          dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Quam quisque id diam vel.
          At tempor commodo ullamcorper a. Consectetur a erat nam at lectus urna
          duis convallis convallis. Quis commodo odio aenean sed. Porta nibh
          venenatis cras sed felis eget velit aliquet. Senectus et netus et
          malesuada fames ac turpis.
        </Paragraph>
        <Paragraph>
          Mauris pharetra et ultrices neque ornare. Commodo odio aenean sed
          adipiscing diam. A erat nam at lectus. Adipiscing at in tellus integer
          feugiat scelerisque varius morbi enim. Ornare arcu dui vivamus arcu
          felis. Vel pretium lectus quam id leo in vitae turpis massa. Odio ut
          enim blandit volutpat maecenas volutpat blandit.
        </Paragraph>
        {/* Refactor containers later */}
        <div className={styles.container}>
          <div className={styles["interactive-container"]}>
            <div className={styles["interactive-container--inner"]}>
              <XRayCrystallographyGame />
            </div>
          </div>
        </div>
        <div className={styles.container}>
          <div className={styles["interactive-container"]}>
            <div className={styles["interactive-container--inner"]}>
              <DNADoubleHelixCanvas slide={slide} />
            </div>
          </div>
          <div className={styles["text-container"]}>
            Welcome to genetics interactive
            <button onClick={() => setSlide((slide) => slide + 1)}>Next</button>
            <button onClick={() => setSlide(0)}>Reset</button>
            <p>{`Slide ${slide}`}</p>
          </div>
        </div>
        <Paragraph>
          Leo urna molestie at elementum eu facilisis sed. Tortor at auctor urna
          nunc id. Dictum fusce ut placerat orci nulla pellentesque dignissim
          enim sit. Pretium nibh ipsum consequat nisl vel. Orci sagittis eu
          volutpat odio facilisis mauris sit amet massa. At tempor commodo
          ullamcorper a lacus. Aliquam vestibulum morbi blandit cursus risus at
          ultrices. Risus at ultrices mi tempus. Ac tortor vitae purus faucibus
          ornare suspendisse. Ornare lectus sit amet est placerat.
        </Paragraph>
      </ArticleContainer>
      <Footer />
    </>
  );
};

export default GeneticsPage;

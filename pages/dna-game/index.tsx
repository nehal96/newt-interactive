import { ArticleContainer, Navbar, Title } from "../../components";
import styles from "./dna-game.module.css";

const DNAGame = () => {
  return (
    <>
      <Navbar />
      <ArticleContainer>
        <Title>DNA Game</Title>
        <div className={styles.container}>
          <canvas
            style={{
              height: 400,
              width: 600,
              backgroundColor: "#eee",
              alignItems: "center",
            }}
          ></canvas>
        </div>
      </ArticleContainer>
    </>
  );
};

export default DNAGame;

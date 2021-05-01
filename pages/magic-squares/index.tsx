import { ArticleContainer, Navbar, Title, Lede } from "../../components";
import MagicSquare from "./MagicSquare";

const MagicSquaresInteractive = () => {
  return (
    <>
      <Navbar />
      <ArticleContainer>
        <Title>The Mystery of Magic Squares</Title>
        <Lede>An animated exploration of magic squares</Lede>
        <MagicSquare
          name="main"
          values={[
            [2, 9, 4],
            [7, 5, 3],
            [6, 1, 8],
          ]}
          withTotals={true}
        />
      </ArticleContainer>
    </>
  );
};

export default MagicSquaresInteractive;

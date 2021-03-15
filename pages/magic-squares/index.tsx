import { ArticleContainer, Navbar, Title, Lede } from "../../components";
import MagicSquare from "./MagicSquare";

const MagicSquaresInteractive = () => {
  return (
    <>
      <Navbar />
      <ArticleContainer>
        <Title>The Mystery of Magic Squares</Title>
        <Lede>An animated exploration of magic squares</Lede>
        <MagicSquare n={3} />
      </ArticleContainer>
    </>
  );
};

export default MagicSquaresInteractive;

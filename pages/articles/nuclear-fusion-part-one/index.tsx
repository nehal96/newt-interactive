import {
  ArticleContainer,
  Lede,
  Navbar,
  Paragraph,
  Title,
} from "../../../components";

const NuclearFusionPartOnePage = () => {
  return (
    <>
      <Navbar />
      <ArticleContainer>
        <Title>Nuclear Fusion: Part One</Title>
        <Lede>What is nuclear fusion and how it works</Lede>
        <Paragraph>
          If you have read about nuclear fusion before, you might have come
          across these facts: it is the process that powers the sun and other
          stars in our universe; it is a reaction where two light nuclei combine
          to create a heavier one; it happens in a state of matter called
          plasma. From there, there's usually a jump to nuclear fusion energy
          being clean, accessible, and potentially capable of producing very
          large amounts of energy. There's also short discussions of types of
          nuclear fusion reactors, like tokamaks and stellerators, paired with
          cool-looking diagrams.
        </Paragraph>
        <Paragraph>
          But how do we go from the fundamentals of nuclear physics &mdash;
          nuclei, binding energy, plasma &mdash; to the engineering marvel that
          is a nuclear fusion reactor? In this series, we'll go step-by-step and
          bridge that gap.
        </Paragraph>
        <hr className="self-center w-96 mt-8 mb-16" />
        <Paragraph>jksdfk</Paragraph>
      </ArticleContainer>
    </>
  );
};

export default NuclearFusionPartOnePage;

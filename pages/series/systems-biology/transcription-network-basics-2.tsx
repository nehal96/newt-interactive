import Head from "next/head";
import {
  ArticleContainer,
  Lede,
  Navbar,
  Title,
  Paragraph,
  PostArticleSubscribe,
} from "../../../components";

const TranscriptionNetworkBasicsPartTwo = () => {
  return (
    <>
      <Head>
        <title>Transcription Network Basics: Part Two / Newt Interactive</title>
        <meta
          name="description"
          content="Exploring types of transcription factors and mathematical modeling of protein production in transcription networks"
        />
      </Head>
      <Navbar />
      <ArticleContainer>
        <Title>Transcription Network Basics: Part Two</Title>
        <Lede>Lede</Lede>
        <Paragraph>part two</Paragraph>
        <PostArticleSubscribe />
      </ArticleContainer>
    </>
  );
};

export default TranscriptionNetworkBasicsPartTwo;

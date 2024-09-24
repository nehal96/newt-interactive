import Head from "next/head";
import {
  ArticleContainer,
  Lede,
  Navbar,
  Paragraph,
  Title,
  PostArticleSubscribe,
} from "../../../components";

const TranscriptionNetworkBasicsPartOne = () => {
  return (
    <>
      <Head>
        <title>Transcription Network Basics: Part One / Newt Interactive</title>
        <meta
          name="description"
          content="Interactive explainer on the basics of transcription networks in systems biology"
        />
      </Head>
      <Navbar />
      <ArticleContainer>
        <Title>Transcription Network Basics: Part One</Title>
        <Lede>
          Understanding the fundamental concepts of transcription networks in
          systems biology
        </Lede>
        <Paragraph>Let's say that</Paragraph>
        <PostArticleSubscribe />
      </ArticleContainer>
    </>
  );
};

export default TranscriptionNetworkBasicsPartOne;

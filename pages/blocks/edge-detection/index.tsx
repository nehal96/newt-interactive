import Head from "next/head";
import { ArticleContainer, Lede, Navbar, Title } from "../../../components";
import { EdgeDetectionTutorial } from "../../../interactives/edge-detection";

const EdgeDetectionFilters = () => {
  return (
    <>
      <Head>
        <title>Edge Detection Filters / Newt Interactive</title>
      </Head>
      <Navbar />
      <ArticleContainer>
        <Title>Edge Detection Filters</Title>
        <Lede>kernal convoltions, sobel, cool stuff</Lede>
        <EdgeDetectionTutorial />
      </ArticleContainer>
    </>
  );
};

export default EdgeDetectionFilters;

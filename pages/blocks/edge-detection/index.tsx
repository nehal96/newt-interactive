import Head from "next/head";
import { ArticleContainer, Lede, Navbar, Title } from "../../../components";

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
      </ArticleContainer>
    </>
  );
};

export default EdgeDetectionFilters;

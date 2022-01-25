import Head from "next/head";
import { ArticleContainer, Lede, Navbar, Title } from "../../../components";

const ColorSpacePage = () => {
  return (
    <>
      <Head>
        <title>Color Spaces / Newt Interactive</title>
      </Head>
      <Navbar />
      <ArticleContainer>
        <Title>Color Spaces</Title>
        <Lede>RGB, HSV, images</Lede>
      </ArticleContainer>
    </>
  );
};

export default ColorSpacePage;

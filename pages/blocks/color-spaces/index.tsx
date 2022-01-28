import Head from "next/head";
import Image from "next/image";
import {
  ArticleContainer,
  Button,
  Lede,
  Navbar,
  Title,
} from "../../../components";

const ColorSpacePage = () => {
  const convertImg = async () => {
    const res = await fetch("/api/blocks/color-spaces/test");
    res.json().then((stuff) => console.log(stuff));
  };

  return (
    <>
      <Head>
        <title>Color Spaces / Newt Interactive</title>
      </Head>
      <Navbar />
      <ArticleContainer>
        <Title>Color Spaces</Title>
        <Lede>RGB, HSV, images</Lede>
        <div className="h-[500px] flex flex-col items-center">
          <Image
            src="/images/puppies.jpg"
            width={600}
            height={400}
            layout="fixed"
          />
          <Button variant="primary" onClick={convertImg}>
            Black and white
          </Button>
        </div>
      </ArticleContainer>
    </>
  );
};

export default ColorSpacePage;

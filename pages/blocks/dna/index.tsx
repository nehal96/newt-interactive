import dynamic from "next/dynamic";
import Head from "next/head";
import {
  ArticleContainer,
  Lede,
  Navbar,
  PostArticleSubscribe,
  Title,
} from "../../../components";

const DNADoubleHelixCanvas = dynamic(
  () => import("../../../canvases/DNA-DoubleHelixCanvas"),
  { ssr: false }
);

const DNAPage = () => {
  return (
    <>
      <Head>
        <title>DNA in 3D / Newt Interactive</title>
        <meta
          name="description"
          content="Explore a simplified 3D model of a DNA molecule. Interact with this visual representation to better understand the structure of DNA."
        />
        <meta
          name="keywords"
          content="DNA, 3D model, molecular structure, genetics, biology, interactive visualization"
        />
        <meta property="og:title" content="DNA in 3D / Newt Interactive" />
        <meta
          property="og:description"
          content="Explore a simplified 3D model of a DNA molecule. Interact with this visual representation to better understand the structure of DNA."
        />
        <meta
          property="og:image"
          content="https://i.ibb.co/JQp3PZk/DNA3d.jpg"
        />
        <meta
          property="og:url"
          content="https://www.newtinteractive.com/blocks/dna"
        />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="DNA in 3D / Newt Interactive" />
        <meta
          name="twitter:description"
          content="Explore a simplified 3D model of a DNA molecule. Interact with this visual representation to better understand the structure of DNA."
        />
        <meta
          name="twitter:image"
          content="https://i.ibb.co/JQp3PZk/DNA3d.jpg"
        />
        <meta name="twitter:creator" content="@nehaludyavar" />
      </Head>
      <Navbar />
      <ArticleContainer>
        <Title>DNA in 3D</Title>
        <Lede>A simplified model of a DNA molecule</Lede>
        <div className="flex flex-col justify-center w-full mx-auto my-8 lg:flex-row lg:h-auto lg:my-12">
          <div className="h-3/5 max-h-[600px] m-4 lg:h-[600px] lg:w-3/5">
            <div className="h-full bg-slate-300">
              <DNADoubleHelixCanvas />
            </div>
          </div>
        </div>
        <PostArticleSubscribe />
      </ArticleContainer>
    </>
  );
};

export default DNAPage;

import dynamic from "next/dynamic";
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

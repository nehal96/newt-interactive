import dynamic from "next/dynamic";
import { useState } from "react";
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
  const [slide, setSlide] = useState(0);

  return (
    <>
      <Navbar />
      <ArticleContainer>
        <Title>DNA in 3D</Title>
        <Lede>A simplified model of a DNA molecule</Lede>
        <div className="flex flex-col justify-center w-full h-screen mx-auto my-8 lg:flex-row lg:h-auto lg:my-12">
          <div className="h-3/5 max-h-[600px] m-4 lg:h-[600px] lg:w-3/5">
            <div className="h-full bg-slate-300">
              <DNADoubleHelixCanvas slide={slide} />
            </div>
          </div>
          <div className="h-2/5 max-h-[600px] m-4 p-6 flex flex-col rounded-lg justify-center border border-slate-400 lg:h-[600px] lg:w-2/5 lg:items-center">
            Welcome to genetics interactive
            <button
              className="py-1 px-2 rounded-md border border-slate-500"
              onClick={() => setSlide((slide) => slide + 1)}
            >
              Next
            </button>
            <button
              className="py-1 px-2 rounded-md border border-slate-500"
              onClick={() => setSlide(0)}
            >
              Reset
            </button>
            <p>{`Slide ${slide}`}</p>
          </div>
        </div>
        <PostArticleSubscribe />
      </ArticleContainer>
    </>
  );
};

export default DNAPage;

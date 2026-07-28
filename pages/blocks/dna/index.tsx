import dynamic from "next/dynamic";
import { MdxLayout, PostArticleSubscribe } from "../../../components";

const DNADoubleHelixCanvas = dynamic(
  () => import("../../../canvases/DNA-DoubleHelixCanvas"),
  { ssr: false }
);

const DESCRIPTION =
  "Explore a simplified 3D model of a DNA molecule. Interact with this visual representation to better understand the structure of DNA.";

const metadata = {
  title: "DNA in 3D",
  subtitle: "A simplified model of a DNA molecule",
  description: DESCRIPTION,
  keywords:
    "DNA, 3D model, molecular structure, genetics, biology, interactive visualization",
  ogImage: "https://www.newtinteractive.com/images/og/helix.png",
  url: "https://www.newtinteractive.com/blocks/dna",
  published: "2021-12-30",
};

const DNAPage = () => (
  <MdxLayout metadata={metadata}>
    <div className="flex flex-col justify-center w-full mx-auto my-8 lg:flex-row lg:h-auto lg:my-12">
      <div className="h-3/5 max-h-[600px] m-4 lg:h-[600px] lg:w-3/5">
        <div className="h-full bg-slate-300">
          <DNADoubleHelixCanvas />
        </div>
      </div>
    </div>
    <PostArticleSubscribe />
  </MdxLayout>
);

export default DNAPage;

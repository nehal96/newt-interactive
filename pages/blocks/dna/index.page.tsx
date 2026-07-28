import dynamic from "next/dynamic";
import { MdxLayout, PostArticleSubscribe } from "@ui/article";
import meta from "./meta";

const DNADoubleHelixCanvas = dynamic(
  () => import("./figures/DNA-DoubleHelixCanvas"),
  { ssr: false }
);

const metadata = meta;

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

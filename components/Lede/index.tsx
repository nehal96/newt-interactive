import { useContext } from "react";
import { cn } from "../../lib/utils";
import ArticleDates from "../ArticleDates";
import { ArticleDatesContext } from "../ArticleDates/context";

interface Lede {
  children: React.ReactNode;
}

const Lede = ({ children }: Lede) => {
  const { published } = useContext(ArticleDatesContext);

  return (
    <>
      <h2
        className={cn(
          "text-lg text-slate-400 font-light justify-self-center self-center text-center max-w-3xl md:text-xl",
          published ? "mb-4" : "mb-12 md:mb-16"
        )}
      >
        {children}
      </h2>
      {published && <ArticleDates published={published} />}
    </>
  );
};

export default Lede;

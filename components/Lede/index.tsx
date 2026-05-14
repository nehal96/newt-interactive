import { useContext } from "react";
import ArticleDates from "../ArticleDates";
import { ArticleDatesContext } from "../ArticleDates/context";

interface Lede {
  children: React.ReactNode;
}

const Lede = ({ children }: Lede) => {
  const { published, updated } = useContext(ArticleDatesContext);
  const subtitleClasses = published
    ? "text-lg text-slate-400 font-light justify-self-center self-center text-center mb-4 max-w-3xl md:text-xl"
    : "text-lg text-slate-400 font-light justify-self-center self-center text-center mb-12 md:mb-16 max-w-3xl md:text-xl";

  return (
    <>
      <h2 className={subtitleClasses}>{children}</h2>
      {published && <ArticleDates published={published} updated={updated} />}
    </>
  );
};

export default Lede;

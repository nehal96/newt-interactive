import Title from "../Title";
import ArticleDates from "../ArticleDates";
import { cn } from "../../lib/utils";

interface ArticleHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  published?: string;
}

const ArticleHeader = ({ title, subtitle, published }: ArticleHeaderProps) => (
  <>
    <Title>{title}</Title>
    {subtitle && (
      <h2
        className={cn(
          "text-lg text-slate-400 font-light justify-self-center self-center text-center max-w-3xl md:text-xl",
          published ? "mb-4" : "mb-12 md:mb-16"
        )}
      >
        {subtitle}
      </h2>
    )}
    {published && <ArticleDates published={published} />}
  </>
);

export default ArticleHeader;

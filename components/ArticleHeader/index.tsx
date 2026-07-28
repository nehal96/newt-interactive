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
      <p
        className={cn(
          "text-lg text-ink-500 font-light justify-self-center self-center text-center max-w-3xl md:text-xl",
          published ? "mb-4" : "mb-12 md:mb-16"
        )}
      >
        {subtitle}
      </p>
    )}
    {published && <ArticleDates published={published} />}
  </>
);

export default ArticleHeader;

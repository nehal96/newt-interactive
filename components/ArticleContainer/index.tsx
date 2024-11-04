import { cn } from "../../lib/utils";

interface ArticleContainer {
  children: React.ReactNode;
}
interface ArticleSectionProps {
  variant: "small" | "medium" | "large";
  children: React.ReactNode;
  className?: string;
}

const ArticleContainer = ({ children }: ArticleContainer) => {
  return (
    <article className="flex flex-col max-w-7xl px-4 mx-auto mb-12 sm:px-10 sm:mt-10 md:mt-12 md:px-12">
      {children}
    </article>
  );
};

export const ArticleSection = ({
  children,
  variant = "medium",
  className,
}: ArticleSectionProps) => {
  const variantClass =
    variant === "small"
      ? "my-5"
      : variant === "medium"
      ? "my-10 md:my-12"
      : "my-14 md:my-16";

  return (
    <section className={cn("flex flex-col", variantClass, className)}>
      {children}
    </section>
  );
};

export default ArticleContainer;

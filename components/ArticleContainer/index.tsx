interface ArticleContainer {
  children: React.ReactNode;
}

const ArticleContainer = ({ children }: ArticleContainer) => {
  return (
    <article className="flex flex-col max-w-7xl px-4 mx-auto mb-12 sm:px-10 sm:mt-10 md:mt-12 md:px-12">
      {children}
    </article>
  );
};

export default ArticleContainer;

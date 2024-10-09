import { ArticleContainer, Navbar } from "..";

export default function MdxLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <ArticleContainer>{children}</ArticleContainer>
    </>
  );
}

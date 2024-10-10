import Head from "next/head";
import { ArticleContainer, Navbar } from "..";

interface Metadata {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
  url: string;
}

interface MdxLayoutProps {
  children: React.ReactNode;
  metadata: Metadata;
}

export default function MdxLayout({ children, metadata }: MdxLayoutProps) {
  return (
    <>
      <Head>
        <title>{metadata.title} / Newt Interactive</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:image" content={metadata.ogImage} />
        <meta property="og:url" content={metadata.url} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metadata.title} />
        <meta name="twitter:description" content={metadata.description} />
        <meta name="twitter:image" content={metadata.ogImage} />
        <meta name="twitter:creator" content="@nehaludyavar" />
      </Head>
      <Navbar />
      <ArticleContainer>{children}</ArticleContainer>
    </>
  );
}

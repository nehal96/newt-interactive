import Head from "next/head";
import { ArticleContainer, Navbar } from "..";
import { SeriesTitleLink } from "..";

interface Metadata {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
  url: string;
  series?: {
    name: string;
    href: string;
  };
}

interface MdxLayoutProps {
  children: React.ReactNode;
  metadata: Metadata;
}

export default function MdxLayout({ children, metadata }: MdxLayoutProps) {
  const pageTitle = metadata?.title
    ? `${metadata.title} / Newt Interactive`
    : "Newt Interactive";

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        {metadata?.description && (
          <meta name="description" content={metadata?.description} />
        )}
        {metadata?.keywords && (
          <meta name="keywords" content={metadata?.keywords} />
        )}
        <meta property="og:title" content={pageTitle} />
        {metadata?.description && (
          <meta property="og:description" content={metadata?.description} />
        )}
        {metadata?.ogImage && (
          <meta property="og:image" content={metadata?.ogImage} />
        )}
        {metadata?.url && <meta property="og:url" content={metadata?.url} />}
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        {metadata?.description && (
          <meta name="twitter:description" content={metadata?.description} />
        )}
        {metadata?.ogImage && (
          <meta name="twitter:image" content={metadata?.ogImage} />
        )}
        <meta name="twitter:creator" content="@nehaludyavar" />
      </Head>
      <Navbar />
      <ArticleContainer>
        {metadata.series && (
          <SeriesTitleLink
            href={metadata.series?.href}
            seriesName={metadata.series?.name}
          />
        )}
        {children}
      </ArticleContainer>
    </>
  );
}

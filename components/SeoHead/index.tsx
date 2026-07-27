import Head from "next/head";

export interface SeoMetadata {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  url?: string;
  ogType?: "article" | "website";
}

const SeoHead = ({ metadata }: { metadata: SeoMetadata }) => {
  const {
    title,
    description,
    keywords,
    ogImage,
    url,
    ogType = "article",
  } = metadata ?? {};
  const pageTitle = title ? `${title} / Newt Interactive` : "Newt Interactive";

  return (
    <Head>
      <title>{pageTitle}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      <meta property="og:title" content={pageTitle} />
      {description && <meta property="og:description" content={description} />}
      {ogImage && <meta property="og:image" content={ogImage} />}
      {url && <meta property="og:url" content={url} />}
      <meta property="og:type" content={ogType} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      {description && <meta name="twitter:description" content={description} />}
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      <meta name="twitter:creator" content="@nehaludyavar" />
    </Head>
  );
};

export default SeoHead;

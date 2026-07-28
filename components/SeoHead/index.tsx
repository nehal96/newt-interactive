import Head from "next/head";
import { SITE_URL } from "../../lib/links";

export interface SeoMetadata {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  url?: string;
  ogType?: "article" | "website";
  published?: string;
  updated?: string;
}

const SITE_NAME = "Newt Interactive";
const AUTHOR = "Nehal Udyavar";

function structuredData(metadata: SeoMetadata) {
  const { title, description, ogImage, url, published, updated } = metadata;
  const publisher = { "@type": "Organization", name: SITE_NAME, url: SITE_URL };

  if (published) {
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: title,
      description,
      image: ogImage,
      datePublished: published,
      dateModified: updated ?? published,
      author: { "@type": "Person", name: AUTHOR, url: SITE_URL },
      publisher,
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      isAccessibleForFree: true,
    };
  }

  return {
    "@context": "https://schema.org",
    "@type": url === SITE_URL ? "WebSite" : "CollectionPage",
    name: title ? `${title} / ${SITE_NAME}` : SITE_NAME,
    description,
    url,
    publisher,
  };
}

const SeoHead = ({ metadata }: { metadata: SeoMetadata }) => {
  const {
    title,
    description,
    keywords,
    ogImage,
    url,
    ogType = "article",
    published,
    updated,
  } = metadata ?? {};
  const pageTitle = title ? `${title} / ${SITE_NAME}` : SITE_NAME;

  return (
    <Head>
      <title>{pageTitle}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={AUTHOR} />
      {url && <link rel="canonical" href={url} />}
      <meta property="og:title" content={pageTitle} />
      {description && <meta property="og:description" content={description} />}
      {ogImage && <meta property="og:image" content={ogImage} />}
      {url && <meta property="og:url" content={url} />}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SITE_NAME} />
      {published && (
        <meta property="article:published_time" content={published} />
      )}
      {published && (
        <meta property="article:modified_time" content={updated ?? published} />
      )}
      {published && <meta property="article:author" content={AUTHOR} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      {description && <meta name="twitter:description" content={description} />}
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      <meta name="twitter:creator" content="@nehaludyavar" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData(metadata ?? {})),
        }}
      />
    </Head>
  );
};

export default SeoHead;

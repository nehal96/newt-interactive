import { ArticleContainer, SeriesTitleLink } from "..";
import ArticleHeader from "../ArticleHeader";
import PageShell from "../PageShell";
import SeoHead, { type SeoMetadata } from "../SeoHead";

export interface Metadata extends SeoMetadata {
  title: string;
  subtitle?: React.ReactNode;
  description: string;
  keywords: string;
  ogImage: string;
  url: string;
  published?: string;
  updated?: string;
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
  return (
    <>
      <SeoHead metadata={metadata} />
      <PageShell>
        <ArticleContainer>
          {metadata.series && (
            <SeriesTitleLink
              href={metadata.series?.href}
              seriesName={metadata.series?.name}
            />
          )}
          <ArticleHeader
            title={metadata.title}
            subtitle={metadata.subtitle}
            published={metadata.published}
          />
          {children}
        </ArticleContainer>
      </PageShell>
    </>
  );
}

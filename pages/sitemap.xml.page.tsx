import type { GetServerSideProps } from "next";
import { catalogueEntries } from "@lib/content";
import { SITE_URL } from "@lib/links";

function buildSitemap() {
  const entries = [
    { href: "/", published: catalogueEntries[0]?.published },
    ...catalogueEntries,
  ];

  const urls = entries
    .map(
      ({ href, published }) => `  <url>
    <loc>${SITE_URL}${href === "/" ? "" : href}</loc>
    <lastmod>${published}</lastmod>
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=86400, stale-while-revalidate=604800"
  );
  res.write(buildSitemap());
  res.end();

  return { props: {} };
};

export default function Sitemap() {
  return null;
}

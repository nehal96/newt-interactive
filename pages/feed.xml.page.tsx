import type { GetServerSideProps } from "next";
import { catalogueEntries } from "@lib/content";
import { SITE_URL } from "@lib/links";

const FEED_TITLE = "Newt Interactive";
const FEED_DESCRIPTION =
  "Interactive, educational explainers and playgrounds on topics in science, technology, engineering, and math";

const escapeXml = (value: string) =>
  value.replace(
    /[<>&'"]/g,
    (c) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        "'": "&apos;",
        '"': "&quot;",
      })[c]
  );

const toRfc822 = (iso: string) => new Date(`${iso}T00:00:00Z`).toUTCString();

function buildFeed() {
  const items = catalogueEntries
    .map(
      ({ href, title, description, published }) => `    <item>
      <title>${escapeXml(title)}</title>
      <link>${SITE_URL}${href}</link>
      <guid isPermaLink="true">${SITE_URL}${href}</guid>
      <description>${escapeXml(description)}</description>
      <pubDate>${toRfc822(published)}</pubDate>
    </item>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${FEED_TITLE}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(FEED_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${toRfc822(catalogueEntries[0].published)}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=86400, stale-while-revalidate=604800"
  );
  res.write(buildFeed());
  res.end();

  return { props: {} };
};

export default function Feed() {
  return null;
}

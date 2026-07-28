import Head from "next/head";
import CoverArt from "@ui/site/CoverArt";
import { MOTIFS } from "@lib/motifs";

/* Capture surface for scripts/og-cards.mjs — one 1200×630 card per motif. */

export const getStaticProps = () =>
  process.env.NODE_ENV === "production" ? { notFound: true } : { props: {} };

export default function OgCards() {
  return (
    <>
      <Head>
        <title>OG cards</title>
        <meta name="robots" content="noindex" />
      </Head>
      {MOTIFS.map((motif) => (
        <div key={motif} data-motif={motif} className="h-[630px] w-[1200px]">
          <CoverArt motif={motif} className="h-full w-full" />
        </div>
      ))}
    </>
  );
}

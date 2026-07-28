import Head from "next/head";
import CoverArt, { type Motif } from "../components/CoverArt";

/* Capture surface for scripts/og-cards.mjs — one 1200×630 card per motif. */

const MOTIFS: Motif[] = [
  "network",
  "network-layered",
  "circuit",
  "generations",
  "distributions",
  "helix",
  "bars",
  "wireframe",
];

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

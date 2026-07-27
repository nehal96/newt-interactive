import Head from "next/head";
import {
  FeaturedPiece,
  PieceRow,
  ArchiveRow,
  Navbar,
  Footer,
  SubscribeForm,
} from "../components";
import { archivedPieces, featuredPiece, restOfPieces } from "../lib/content";

const DESCRIPTION =
  "Interactive, educational explainers and playgrounds on topics in science, technology, engineering, and math";

const linkClass =
  "text-slate-800 underline decoration-slate-300 underline-offset-2 transition-colors hover:text-slate-900 hover:decoration-slate-500";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Head>
        <title>Newt Interactive</title>
        <meta name="description" content={DESCRIPTION} />
        <meta name="keywords" content={DESCRIPTION} />
        <meta property="og:title" content="Newt Interactive" />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:image" content="https://i.ibb.co/NpXN5rj/Meta-tag-image-1.png" />
        <meta property="og:url" content="https://www.newtinteractive.com" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@nehaludyavar" />
        <meta name="twitter:title" content="Newt Interactive" />
        <meta name="twitter:description" content={DESCRIPTION} />
        <meta name="twitter:image" content="https://i.ibb.co/NpXN5rj/Meta-tag-image-1.png" />
      </Head>

      <Navbar />

      <main className="mx-auto w-full max-w-column flex-auto px-5">
        {featuredPiece && (
          <section className="pt-8 sm:pt-10">
            <FeaturedPiece piece={featuredPiece} />
          </section>
        )}

        {/* The index opens on a rule rather than a heading — the rows say what
            they are, so a label above them was only naming the obvious. */}
        <section className="mt-14 border-t border-slate-900/80 sm:mt-16">
          {restOfPieces.map((piece) => (
            <PieceRow key={piece.href} piece={piece} />
          ))}
        </section>

        {/* The archive does need naming — unlike the index above it, a list of
            titles and dates doesn't explain itself. Everything about it is a
            step quieter: lighter rule, grey label, one line per piece. */}
        {archivedPieces.length > 0 && (
          <section className="mt-12 sm:mt-14">
            <h2 className="border-b border-slate-200 pb-2 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-slate-400">
              Archive
            </h2>
            {archivedPieces.map((piece) => (
              <ArchiveRow key={piece.href} piece={piece} />
            ))}
          </section>
        )}

        <section id="subscribe" className="scroll-mt-20 py-16 sm:py-20">
          {/* What this is, said once, at the end — a colophon rather than a
              headline. Sans and cool grey: the index does the talking above
              it, and this only has to answer "what is this site" for whoever
              read to the bottom. */}
          <h1 className="max-w-[34rem] font-ui text-base leading-relaxed tracking-[-0.005em] text-slate-500 sm:text-[1.0625rem]">
            Interactive explainers and playgrounds on topics in science,
            technology, engineering, and math.
          </h1>

          <div className="mt-10 sm:mt-12">
            <SubscribeForm variant="bare" />
          </div>
          <p className="mt-8 max-w-[34rem] font-ui text-[0.9375rem] leading-relaxed text-slate-500">
            If you have suggestions, found bugs, or just want to reach out, feel
            free to{" "}
            <a
              href="https://www.twitter.com/nehaludyavar"
              target="_blank"
              rel="noreferrer noopener"
              className={linkClass}
            >
              DM me on Twitter
            </a>{" "}
            or{" "}
            <a
              href={`mailto:nehaludyavar@gmail.com?subject=${encodeURIComponent("Hello")}`}
              target="_blank"
              rel="noreferrer noopener"
              className={linkClass}
            >
              send me an email
            </a>
            .
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}

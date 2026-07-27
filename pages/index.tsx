import { PageShell, SeoHead, SubscribeForm } from "../components";
import { ArchiveRow, FeaturedPiece, PieceRow } from "../components/Homepage";
import { archivedPieces, featuredPiece, restOfPieces } from "../lib/content";
import { EMAIL_HREF, TWITTER_URL } from "../lib/links";

const DESCRIPTION =
  "Interactive, educational explainers and playgrounds on topics in science, technology, engineering, and math";

const metadata = {
  description: DESCRIPTION,
  keywords: DESCRIPTION,
  ogImage: "https://i.ibb.co/NpXN5rj/Meta-tag-image-1.png",
  url: "https://www.newtinteractive.com",
  ogType: "website" as const,
};

const linkClass =
  "text-ink-800 underline decoration-ink-300 underline-offset-2 transition-colors hover:text-ink-900 hover:decoration-ink-500";

export default function Home() {
  return (
    <>
      <SeoHead metadata={metadata} />
      <PageShell>
        <div className="mx-auto w-full max-w-column px-5">
          {featuredPiece && (
            <section className="pt-8 sm:pt-10">
              <FeaturedPiece piece={featuredPiece} />
            </section>
          )}

          <section className="mt-14 border-t border-ink-400 sm:mt-16">
            {restOfPieces.map((piece) => (
              <PieceRow key={piece.href} piece={piece} />
            ))}
          </section>

          {archivedPieces.length > 0 && (
            <section className="mt-12 sm:mt-14">
              <h2 className="border-b border-ink-200 pb-2 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-ink-400">
                Archive
              </h2>
              {archivedPieces.map((piece) => (
                <ArchiveRow key={piece.href} piece={piece} />
              ))}
            </section>
          )}

          <section id="subscribe" className="py-16 sm:py-20">
            <p className="max-w-[34rem] font-ui text-base leading-relaxed tracking-[-0.005em] text-ink-500 sm:text-[1.0625rem]">
              Interactive explainers and playgrounds on topics in science,
              technology, engineering, and math.
            </p>

            <div className="mt-10 sm:mt-12">
              <SubscribeForm variant="bare" />
            </div>
            <p className="mt-8 max-w-[34rem] font-ui text-[0.9375rem] leading-relaxed text-ink-500">
              If you have suggestions, found bugs, or just want to reach out, feel
              free to{" "}
              <a
                href={TWITTER_URL}
                target="_blank"
                rel="noreferrer noopener"
                className={linkClass}
              >
                DM me on Twitter
              </a>{" "}
              or{" "}
              <a
                href={EMAIL_HREF}
                target="_blank"
                rel="noreferrer noopener"
                className={linkClass}
              >
                send me an email
              </a>
              .
            </p>
          </section>
        </div>
      </PageShell>
    </>
  );
}

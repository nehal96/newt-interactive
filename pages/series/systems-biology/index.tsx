import Head from "next/head";
import { ArticleContainer, ArticleHeader, Footer, Navbar, PartsTable } from "../../../components";
import { getPiece, partsBySection } from "../../../lib/content";
import { cn } from "../../../lib/utils";

/* The series' own page. Its instalments are the same rows the homepage lists
   under the series — numbered, dated, on the index's hairlines — read from the
   catalogue rather than written out again here, so there's one list to keep in
   order. The subheadings are the thing this page has that the index doesn't:
   the homepage shows the shape of the series, this shows how it's organised. */

const HREF = "/series/systems-biology";

const SystemsBiologyExplainersPage = () => {
  const piece = getPiece(HREF);
  const sections = partsBySection(piece?.parts);

  return (
    <>
      <Head>
        <title>Systems Biology / Newt Interactive</title>
        <meta
          name="description"
          content="Explore interactive explainers on systems biology concepts"
        />
        <meta
          name="keywords"
          content="systems biology, interactive explainers, transcription networks, gene expression, biological systems"
        />
        <meta property="og:title" content="Systems Biology / Newt Interactive" />
        <meta
          property="og:description"
          content="Explore interactive explainers on systems biology concepts"
        />
        <meta property="og:image" content="https://i.ibb.co/Nnbfc6y/genetic-circuit.png" />
        <meta property="og:url" content="https://newtinteractive.com/series/systems-biology" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Systems Biology / Newt Interactive" />
        <meta
          name="twitter:description"
          content="Explore interactive explainers on systems biology concepts"
        />
        <meta name="twitter:image" content="https://i.ibb.co/Nnbfc6y/genetic-circuit.png" />
      </Head>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex-auto">
          <ArticleContainer>
            <ArticleHeader title={piece?.title ?? "Systems Biology"} subtitle={piece?.subtitle} />
            {sections.map(({ section, start, parts }, i) => (
              <div
                key={section ?? start}
                className={cn("w-full max-w-prose self-center", i > 0 && "mt-12")}
              >
                {/* Mono caps, the index's label register — these name a group
                    of rows rather than open a chapter, and the numbered table
                    under each one is already doing the talking. */}
                {section && (
                  <h2 className="font-mono font-medium text-xs uppercase tracking-[0.12em] text-ink-900">
                    {section}
                  </h2>
                )}
                <PartsTable parts={parts} start={start} nested={false} />
              </div>
            ))}
          </ArticleContainer>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default SystemsBiologyExplainersPage;

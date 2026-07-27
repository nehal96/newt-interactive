import { MdxLayout } from "../../../components";
import { PartsTable } from "../../../components/Homepage";
import { getPiece, partsBySection } from "../../../lib/content";
import { cn } from "../../../lib/utils";

/* The series' own page. Its instalments are the same rows the homepage lists
   under the series — numbered, dated, on the index's hairlines — read from the
   catalogue rather than written out again here, so there's one list to keep in
   order. The subheadings are the thing this page has that the index doesn't:
   the homepage shows the shape of the series, this shows how it's organised.

   It isn't authored in MDX, but it still goes through MdxLayout: the SEO tags
   and the page chrome are the same job here as on an essay, and a hand-written
   copy of them is a copy that gets left behind. */

const HREF = "/series/systems-biology";

const piece = getPiece(HREF);

const metadata = {
  title: piece.title,
  subtitle: piece.subtitle,
  description: "Explore interactive explainers on systems biology concepts",
  keywords:
    "systems biology, interactive explainers, transcription networks, gene expression, biological systems",
  ogImage: "https://i.ibb.co/Nnbfc6y/genetic-circuit.png",
  url: "https://newtinteractive.com/series/systems-biology",
  // An index of pieces rather than a piece.
  ogType: "website" as const,
};

const SystemsBiologyExplainersPage = () => (
  <MdxLayout metadata={metadata}>
    {partsBySection(piece.parts).map(({ section, start, parts }, i) => (
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
  </MdxLayout>
);

export default SystemsBiologyExplainersPage;

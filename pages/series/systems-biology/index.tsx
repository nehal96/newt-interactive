import { MdxLayout } from "../../../components";
import { PartsTable } from "../../../components/Homepage";
import { getPiece, partsBySection } from "../../../lib/content";
import { cn } from "../../../lib/utils";

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
  ogType: "website" as const,
};

const SystemsBiologyExplainersPage = () => (
  <MdxLayout metadata={metadata}>
    {partsBySection(piece.parts).map(({ section, start, parts }, i) => (
      <div
        key={section ?? start}
        className={cn("w-full max-w-prose self-center", i > 0 && "mt-12")}
      >
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

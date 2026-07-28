import { MdxLayout } from "@ui/article";
import { PartsTable } from "@ui/site/Homepage";
import { partsBySection } from "@lib/content";
import { cn } from "@lib/utils";
import meta from "./meta";

const metadata = meta;

const SystemsBiologyExplainersPage = () => (
  <MdxLayout metadata={metadata}>
    {partsBySection(meta.parts).map(({ section, start, parts }, i) => (
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

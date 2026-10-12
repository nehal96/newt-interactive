import { type ReactNode } from "react";
import { cn } from "@lib/utils";

// A side note on the working: what a station's numbers come to against the paper's.
export default function LabNote({ title, children }: { title: string; children: ReactNode }) {
  return (
    <aside
      className={cn(
        "my-6 w-full max-w-prose self-center rounded-lg border border-dashed border-ink-200 px-4 py-3 font-ui text-sm leading-6 text-ink-600",
        "[&_p]:m-0 [&_p]:max-w-none [&_p]:font-ui [&_p]:text-sm [&_p]:leading-6 [&_p]:tracking-normal [&_p]:text-ink-600",
        "md:[&_p]:mb-0 md:[&_p]:tracking-normal"
      )}
    >
      <div className="mb-1 font-semibold text-ink-700">{title}</div>
      {children}
    </aside>
  );
}

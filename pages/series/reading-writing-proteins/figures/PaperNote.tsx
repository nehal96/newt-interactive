import { type ReactNode } from "react";

// A quote from a source, with its citation and, optionally, how the source
// differs from the modern telling.
export default function PaperNote({
  cite,
  differs,
  children,
}: {
  cite: string;
  differs?: ReactNode;
  children: ReactNode;
}) {
  return (
    <aside className="my-6 w-full max-w-prose self-center border-l-2 border-ink-200 pl-4 font-ui text-[0.95rem] leading-7 text-ink-700">
      <div>{children}</div>
      <div className="mt-1 font-mono text-xs uppercase tracking-[0.08em] text-ink-500">
        {cite}
      </div>
      {differs && <div className="mt-2 text-sm text-ink-600">{differs}</div>}
    </aside>
  );
}

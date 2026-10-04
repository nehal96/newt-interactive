import { type ReactNode } from "react";

/** Highlights prose dropped in from the handoff doc, until it's been rewritten. */
export default function Draft({ children }: { children: ReactNode }) {
  return (
    <div
      title="Draft text from the handoff doc"
      className="mb-5 w-full max-w-prose self-center rounded-sm bg-amber-100/60 shadow-[0_0_0_0.5rem_rgb(254_243_199_/_0.6)] md:mb-8 [&>p:last-child]:mb-0"
    >
      {children}
    </div>
  );
}

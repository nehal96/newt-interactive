import { type ReactNode } from "react";

// The frame around an interactive.
export default function Panel({ children }: { children: ReactNode }) {
  return (
    <figure className="my-8 w-full max-w-prose self-center rounded-xl border border-ink-200 p-4 sm:p-5">
      {children}
    </figure>
  );
}

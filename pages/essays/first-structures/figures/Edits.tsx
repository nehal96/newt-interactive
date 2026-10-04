// Marks Claude's suggested changes to the author's prose, until they're accepted or undone.
import { type ReactNode } from "react";
import { Paragraph } from "@ui/prose";

export function Add({ children }: { children: ReactNode }) {
  return (
    <mark
      title="Added by Claude"
      className="rounded-sm bg-amber-100 px-0.5 text-inherit [box-decoration-break:clone]"
    >
      {children}
    </mark>
  );
}

export function Cut({ children }: { children: ReactNode }) {
  return (
    <del title="Cut by Claude" className="text-ink-400 decoration-ink-400">
      {children}
    </del>
  );
}

/** A whole added paragraph; a lone tag in MDX isn't wrapped in a paragraph. */
export function AddParagraph({ children }: { children: ReactNode }) {
  return (
    <Paragraph>
      <Add>{children}</Add>
    </Paragraph>
  );
}

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useInViewport } from "@hooks";
import type { Part } from "./PerutzModelCanvas";

const PerutzModelCanvas = dynamic(() => import("./PerutzModelCanvas"), { ssr: false });

const LABELS: Record<Part["kind"], { name: string; text: string }> = {
  alpha: {
    name: "α chain",
    text: "141 amino acids, folded almost exactly like myoglobin.",
  },
  beta: {
    name: "β chain",
    text: "146 amino acids, also folded like myoglobin. Its reactive cysteine, where the mercury bound in 1953, sits beside the heme.",
  },
  haem: {
    name: "Heme",
    text: "The iron-holding ring that binds oxygen. Each sits in its own pocket on the surface; the nearest two irons are 24 Å apart.",
  },
};

export function PerutzModel() {
  const ref = useRef<HTMLDivElement>(null);
  const { hasBeenNear, isActive } = useInViewport(ref);
  const [hover, setHover] = useState<Part | null>(null);
  const label = hover && LABELS[hover.kind];
  return (
    <div className="w-full">
      <div
        ref={ref}
        className="aspect-[4/3] w-full touch-none"
        style={{ cursor: hover ? "pointer" : "grab" }}
      >
        {hasBeenNear && <PerutzModelCanvas active={isActive} hover={hover} onHover={setHover} />}
      </div>
      <div className="mt-3 min-h-[3.75rem] text-sm leading-5" aria-live="polite">
        {label ? (
          <>
            <p className="font-semibold text-ink-800">{label.name}</p>
            <p className="text-ink-600">{label.text}</p>
          </>
        ) : (
          <p className="text-ink-400">Drag to turn it. Point at a chain or a heme to see what it is.</p>
        )}
      </div>
    </div>
  );
}

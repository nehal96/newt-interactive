import { type ReactNode } from "react";
import { XR } from "./palette";

const INK = {
  unitCell: XR.accent,
} as const;

export type TermKey = keyof typeof INK;

export default function Term({ k, children }: { k: TermKey; children: ReactNode }) {
  return <span style={{ color: INK[k], fontWeight: 500 }}>{children}</span>;
}

import { type ReactNode } from "react";
import { HB } from "./palette";

// Color-coded inline term for the essay prose. Wraps a word/phrase in the same
// color its entity carries in the diagrams, charts and 3D — so "iron" in the
// text and the orange sphere in the figure read as the same thing. Uses the
// darker `ink` variant for legibility on the white page, with a light weight
// bump so a colored term reads as deliberate rather than as a stray link.
//
// Structural parts that have no dedicated figure color (pyrrole, porphyrin, the
// histidines) map to `null` — they're emphasized by weight alone (bold, default
// text color) rather than by color.
//
// Applied to the first / anchor mention of each tracked term (near its figure),
// not every occurrence, to keep the page calm.
const INK: Record<string, string | null> = {
  iron: HB.iron.ink,
  oxygen: HB.oxygen.ink,
  nitrogen: HB.nitrogen.ink,
  alpha: HB.alpha.ink,
  beta: HB.beta.ink,
  acid: HB.acid.ink,
  co2: HB.co2.ink,
  bpg: HB.bpg.ink,
  fetalHb: HB.fetalHb.ink,
  // structural parts without a dedicated color — bold only
  pyrrole: null,
  porphyrin: null,
  proximalHis: null,
  distalHis: null,
  heme: null,
  dimer: null,
  // mechanism concepts — bold only
  tense: null,
  relaxed: null,
  saltBridge: null,
  cooperativity: null,
  bohr: null,
  haldane: null,
};

export type TermKey = keyof typeof INK;

export default function Term({
  k,
  children,
}: {
  k: TermKey;
  children: ReactNode;
}) {
  const ink = INK[k];
  return (
    <span style={{ color: ink ?? undefined, fontWeight: ink ? 500 : 600 }}>
      {children}
    </span>
  );
}

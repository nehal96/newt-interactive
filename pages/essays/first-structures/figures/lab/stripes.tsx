// A horizontal SVG gradient that paints a profile along x, for stripe sheets and their stacks.
import { XR } from "../palette";

const STOPS = 120;

/** `alpha(x)` for x from 0 to 1 across the box, laid between x0 and x1 in user space. */
export function Profile({ id, x0, x1, alpha, colour = XR.first }: { id: string; x0: number; x1: number; alpha: (x: number) => number; colour?: string }) {
  return (
    <linearGradient id={id} gradientUnits="userSpaceOnUse" x1={x0} x2={x1} y1={0} y2={0}>
      {Array.from({ length: STOPS + 1 }, (_, i) => {
        const x = i / STOPS;
        return <stop key={i} offset={x} stopColor={colour} stopOpacity={Math.max(0, Math.min(1, alpha(x)))} />;
      })}
    </linearGradient>
  );
}

/** How bold spot n's stripe is at x: full on its in-step lines, clear halfway between. `shift` slides the sheet, in stripes. */
export const stripe = (n: number, x: number, shift = 0) => (1 + Math.cos(2 * Math.PI * (n * x - shift))) / 2;

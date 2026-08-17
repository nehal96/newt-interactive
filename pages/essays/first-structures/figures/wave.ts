export const TAU = Math.PI * 2;

/** One sine, or the sum of several, as an SVG polyline. */
export function wavePath(
  x0: number,
  y0: number,
  len: number,
  amp: number,
  lambda: number,
  phases: number[],
  step = 2
) {
  const at = (x: number) =>
    phases.reduce((sum, p) => sum + Math.sin((TAU * x) / lambda - p), 0);
  let d = `M${x0} ${(y0 - amp * at(0)).toFixed(2)}`;
  for (let x = step; x <= len; x += step)
    d += `L${(x0 + x).toFixed(1)} ${(y0 - amp * at(x)).toFixed(2)}`;
  return d;
}

/** Combined amplitude of two equal waves a path difference apart, 0–1. */
export const combined = (shiftInWavelengths: number) =>
  Math.abs(Math.cos(Math.PI * shiftInWavelengths));

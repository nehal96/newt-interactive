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

/** Any function of x as an SVG polyline, drawn up from the baseline y0. */
export function curvePath(
  x0: number,
  y0: number,
  len: number,
  f: (x: number) => number,
  step = 2
) {
  let d = "";
  for (let x = 0; x <= len; x += step)
    d += `${x ? "L" : "M"}${(x0 + x).toFixed(1)} ${(y0 - f(x)).toFixed(2)}`;
  return d;
}

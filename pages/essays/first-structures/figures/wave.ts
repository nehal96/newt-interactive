export const TAU = Math.PI * 2;

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

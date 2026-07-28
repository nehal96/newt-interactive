// Pure geometry for the chart kit: path builders and axis tick steps.

export type Curve = "linear" | "monotone";

const fmt = (n: number) => (Math.round(n * 100) / 100).toString();

export const point = ([x, y]: [number, number]) => `${fmt(x)},${fmt(y)}`;

const linearPath = (pts: [number, number][]) =>
  pts.map((p, i) => `${i === 0 ? "M" : "L"}${point(p)}`).join("");

// Fritsch–Carlson monotone cubic — never overshoots a sample, so a series that
// only climbs never dips between its points.
const monotonePath = (pts: [number, number][]) => {
  const n = pts.length;
  if (n < 3) return linearPath(pts);

  const dx: number[] = [];
  const slope: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    dx[i] = pts[i + 1][0] - pts[i][0];
    slope[i] = dx[i] === 0 ? 0 : (pts[i + 1][1] - pts[i][1]) / dx[i];
  }

  const tangent = [slope[0]];
  for (let i = 1; i < n - 1; i++) {
    if (slope[i - 1] * slope[i] <= 0) {
      tangent[i] = 0;
    } else {
      const span = dx[i - 1] + dx[i];
      tangent[i] =
        (3 * span) / ((span + dx[i]) / slope[i - 1] + (span + dx[i - 1]) / slope[i]);
    }
  }
  tangent[n - 1] = slope[n - 2];

  let d = `M${point(pts[0])}`;
  for (let i = 0; i < n - 1; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[i + 1];
    const third = dx[i] / 3;
    d += `C${point([x0 + third, y0 + tangent[i] * third])},${point([
      x1 - third,
      y1 - tangent[i + 1] * third,
    ])},${point(pts[i + 1])}`;
  }
  return d;
};

export const curvePath = (pts: [number, number][], curve: Curve = "linear") =>
  curve === "monotone" ? monotonePath(pts) : linearPath(pts);

// The d3 tick step: the 1, 2 or 5 × 10ⁿ that lands closest to `count` divisions.
export function niceTicks(min: number, max: number, count = 5): number[] {
  if (!(max > min) || count < 1) return [];
  const rough = (max - min) / count;
  const power = Math.floor(Math.log10(rough));
  const error = rough / 10 ** power;
  const step =
    (error >= 7.07 ? 10 : error >= 3.16 ? 5 : error >= 1.41 ? 2 : 1) *
    10 ** power;

  const ticks: number[] = [];
  for (let i = Math.ceil(min / step); i * step <= max; i++) {
    ticks.push(Number((i * step).toPrecision(12)));
  }
  return ticks;
}

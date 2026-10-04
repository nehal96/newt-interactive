/** Marching squares over an n × n grid: one SVG path of contour segments, in grid units, at each level. */
export function contourPath(map: ArrayLike<number>, n: number, levels: number[]) {
  let d = "";
  const at = (ix: number, iy: number) => map[iy * n + ix];
  for (const level of levels) {
    for (let iy = 0; iy < n - 1; iy++)
      for (let ix = 0; ix < n - 1; ix++) {
        const v = [at(ix, iy), at(ix + 1, iy), at(ix + 1, iy + 1), at(ix, iy + 1)];
        const c = [[ix, iy], [ix + 1, iy], [ix + 1, iy + 1], [ix, iy + 1]];
        const pts: [number, number][] = [];
        for (let e = 0; e < 4; e++) {
          const a = v[e];
          const b = v[(e + 1) % 4];
          if ((a >= level) !== (b >= level)) {
            const t = (level - a) / (b - a);
            const [x0, y0] = c[e];
            const [x1, y1] = c[(e + 1) % 4];
            pts.push([x0 + t * (x1 - x0), y0 + t * (y1 - y0)]);
          }
        }
        for (let p = 0; p + 1 < pts.length; p += 2)
          d += `M${pts[p][0].toFixed(2)} ${pts[p][1].toFixed(2)}L${pts[p + 1][0].toFixed(2)} ${pts[p + 1][1].toFixed(2)}`;
      }
  }
  return d;
}

export type Point = { x: number; y: number };

type SampleRange = { min?: number; max?: number; step?: number };

export const sample = (
  fn: (x: number) => number,
  { min = 0, max = 20, step = 1 }: SampleRange = {}
): Point[] => {
  const points: Point[] = [];
  const steps = Math.round((max - min) / step);

  for (let i = 0; i <= steps; i++) {
    const x = min + i * step;
    points.push({ x, y: fn(x) });
  }

  return points;
};

export const getActivatorHillFunctionData = (
  beta = 10,
  K = 1,
  n = 1,
  min = 0,
  max = 20
) => sample((x) => (beta * x ** n) / (K ** n + x ** n), { min, max });

export const getRepressorHillFunctionData = (
  beta = 10,
  K = 1,
  n = 1,
  min = 0,
  max = 20
) => sample((x) => (beta * K ** n) / (K ** n + x ** n), { min, max });

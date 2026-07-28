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

const CURVE_STEP = 0.2;
const TRANSITION_SAMPLES = 24;

// A Hill curve's transition narrows as n grows — by n = 50 it is a near-vertical
// jump a fraction of K wide — so a step coarse enough for n = 1 renders it as a
// visible staircase. Resolve the 10–90% band instead, and divide the range
// evenly so the curve still ends exactly on `max`.
const hillStep = (K: number, n: number, min: number, max: number) => {
  const band = K * (9 ** (1 / n) - 9 ** (-1 / n));
  const target = Math.min(CURVE_STEP, band / TRANSITION_SAMPLES);
  return (max - min) / Math.ceil((max - min) / target);
};

export const getActivatorHillFunctionData = (
  beta = 10,
  K = 1,
  n = 1,
  min = 0,
  max = 20
) =>
  sample((x) => (beta * x ** n) / (K ** n + x ** n), {
    min,
    max,
    step: hillStep(K, n, min, max),
  });

export const getRepressorHillFunctionData = (
  beta = 10,
  K = 1,
  n = 1,
  min = 0,
  max = 20
) =>
  sample((x) => (beta * K ** n) / (K ** n + x ** n), {
    min,
    max,
    step: hillStep(K, n, min, max),
  });

export type ResponseCurve = (
  t: number,
  alpha: number,
  steadyState: number
) => number;

export const accumulationCurve: ResponseCurve = (t, alpha, steadyState) =>
  steadyState * (1 - Math.exp(-alpha * t));

export const decayCurve: ResponseCurve = (t, alpha, steadyState) =>
  steadyState * Math.exp(-alpha * t);

export const responseTime = (alpha: number) => Math.log(2) / alpha;

export const getResponseCurveData = (
  curve: ResponseCurve,
  alpha: number,
  steadyState: number
) => sample((t) => curve(t, alpha, steadyState), { step: CURVE_STEP });

// Production at rate `beta` until it hits `steadyState`, flat thereafter.
export const rampToSteadyState = (steadyState: number, beta: number) =>
  sample((t) => Math.min(t * beta, steadyState), { max: 20, step: 0.1 });

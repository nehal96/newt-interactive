import { type Curve, curvePath, point } from "./path";
import { useScale } from "./Plot";

export type Datum = { x: number; y: number };

export function Line({
  data,
  stroke,
  width = 2,
  curve = "linear",
  dashed = false,
  opacity,
}: {
  data: Datum[];
  stroke: string;
  width?: number;
  curve?: Curve;
  dashed?: boolean;
  opacity?: number;
}) {
  const scale = useScale();
  if (data.length < 2) return null;
  return (
    <path
      d={curvePath(
        data.map((d) => [scale.x(d.x), scale.y(d.y)]),
        curve
      )}
      fill="none"
      stroke={stroke}
      strokeWidth={width}
      strokeOpacity={opacity}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...(dashed ? { strokeDasharray: "4 4" } : {})}
    />
  );
}

export function Area({
  data,
  fill,
  opacity,
  curve = "linear",
  baseline = 0,
  className,
}: {
  data: Datum[];
  fill: string;
  opacity?: number;
  curve?: Curve;
  baseline?: number;
  className?: string;
}) {
  const scale = useScale();
  if (data.length < 2) return null;
  const top: [number, number][] = data.map((d) => [scale.x(d.x), scale.y(d.y)]);
  const floor = scale.y(baseline);
  const close = `L${point([top[top.length - 1][0], floor])}L${point([
    top[0][0],
    floor,
  ])}Z`;
  return (
    <path
      d={curvePath(top, curve) + close}
      fill={fill}
      fillOpacity={opacity}
      className={className}
    />
  );
}

export function Dot({
  x,
  y,
  r = 2,
  fill,
  stroke,
  strokeWidth,
}: {
  x: number;
  y: number;
  r?: number;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
}) {
  const scale = useScale();
  return (
    <circle
      cx={scale.x(x)}
      cy={scale.y(y)}
      r={r}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  );
}

import { createContext, type ReactNode, useContext, useId } from "react";
import { cn } from "@lib/utils";

export type Scale = {
  x: (value: number) => number;
  y: (value: number) => number;
  /** The plot box in SVG user units. */
  box: { left: number; right: number; top: number; bottom: number };
};

export type Tick = [value: number, label: ReactNode];

const ScaleContext = createContext<Scale | null>(null);

export function useScale() {
  const scale = useContext(ScaleContext);
  if (!scale) throw new Error("A chart mark has to sit inside a <Plot>.");
  return scale;
}

export const AXIS = "#94a3b8";
export const LABEL = "#64748b";

export function Plot({
  width,
  height,
  padding,
  x,
  y,
  title,
  desc,
  className,
  children,
}: {
  width: number;
  height: number;
  padding: { top: number; right: number; bottom: number; left: number };
  x: [min: number, max: number];
  y: [min: number, max: number];
  title: string;
  desc?: string;
  className?: string;
  children: ReactNode;
}) {
  const id = useId();
  const box = {
    left: padding.left,
    right: width - padding.right,
    top: padding.top,
    bottom: height - padding.bottom,
  };
  const scale: Scale = {
    x: (value) =>
      box.left + ((value - x[0]) / (x[1] - x[0])) * (box.right - box.left),
    y: (value) =>
      box.bottom - ((value - y[0]) / (y[1] - y[0])) * (box.bottom - box.top),
    box,
  };

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn("block h-auto w-full", className)}
      role="img"
      aria-labelledby={
        desc ? `${id}-title ${id}-desc` : `${id}-title`
      }
    >
      <title id={`${id}-title`}>{title}</title>
      {desc && <desc id={`${id}-desc`}>{desc}</desc>}
      <ScaleContext.Provider value={scale}>{children}</ScaleContext.Provider>
    </svg>
  );
}

export function XAxis({
  ticks = [],
  label,
  stroke = AXIS,
  fill = LABEL,
  fontSize = 11,
  tickSize = 0,
  tickGap = 4,
  labelGap = 22,
}: {
  ticks?: Tick[];
  label?: ReactNode;
  stroke?: string;
  fill?: string;
  fontSize?: number;
  tickSize?: number;
  tickGap?: number;
  labelGap?: number;
}) {
  const { x, box } = useScale();
  return (
    <>
      <line
        x1={box.left}
        y1={box.bottom}
        x2={box.right}
        y2={box.bottom}
        stroke={stroke}
      />
      {ticks.map(([value, text], i) => (
        <g key={`x-${i}`}>
          {tickSize > 0 && (
            <line
              x1={x(value)}
              y1={box.bottom}
              x2={x(value)}
              y2={box.bottom + tickSize}
              stroke={stroke}
            />
          )}
          <text
            x={x(value)}
            y={box.bottom + tickSize + tickGap}
            fill={fill}
            fontSize={fontSize}
            textAnchor="middle"
            dominantBaseline="hanging"
          >
            {text}
          </text>
        </g>
      ))}
      {label && (
        <text
          x={(box.left + box.right) / 2}
          y={box.bottom + labelGap}
          fill={fill}
          fontSize={fontSize}
          textAnchor="middle"
          dominantBaseline="hanging"
        >
          {label}
        </text>
      )}
    </>
  );
}

export function YAxis({
  ticks = [],
  at,
  stroke = AXIS,
  fill = LABEL,
  fontSize = 11,
  tickSize = 0,
  tickGap = 5,
}: {
  ticks?: Tick[];
  /** Data x the axis stands on, when it shouldn't stand on the left edge. */
  at?: number;
  stroke?: string;
  fill?: string;
  fontSize?: number;
  tickSize?: number;
  tickGap?: number;
}) {
  const { x, y, box } = useScale();
  const line = at === undefined ? box.left : x(at);
  return (
    <>
      <line x1={line} y1={box.top} x2={line} y2={box.bottom} stroke={stroke} />
      {ticks.map(([value, text], i) => (
        <g key={`y-${i}`}>
          {tickSize > 0 && (
            <line
              x1={line - tickSize}
              y1={y(value)}
              x2={line}
              y2={y(value)}
              stroke={stroke}
            />
          )}
          <text
            x={line - tickSize - tickGap}
            y={y(value)}
            fill={fill}
            fontSize={fontSize}
            textAnchor="end"
            dominantBaseline="central"
          >
            {text}
          </text>
        </g>
      ))}
    </>
  );
}

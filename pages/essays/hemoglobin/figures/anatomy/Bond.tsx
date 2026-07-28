// Flat SVG bond for the anatomy schematics — a rounded grey stick between two
// atom centers (drawn under the atoms). `dashed` + a thinner width renders a
// coordinate/dative bond (e.g. the Fe–N link from a pyrrole nitrogen).

type BondProps = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  width?: number;
  color?: string;
  dashed?: boolean;
};

export default function Bond({
  x1,
  y1,
  x2,
  y2,
  width = 11,
  color = "#CFCEC6",
  dashed = false,
}: BondProps) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeDasharray={dashed ? `1 ${width * 1.5}` : undefined}
    />
  );
}

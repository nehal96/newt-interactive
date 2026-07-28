import { type ReactNode } from "react";
import {
  Axes,
  Crosshair,
  CURVE,
  Curve,
  GuideLine,
  HILL,
  Plot,
  type Tick,
} from "./chart";
import { type Point } from "./helpers";

interface RepressorGraphProps {
  repressorBeta: number;
  repressorK: number;
  repressorHillFunctionData: Point[];
  children?: ReactNode;
  mainLineColor?: string;
  showKIndicator?: boolean;
}

export const RepressorGraph = ({
  repressorBeta,
  repressorK,
  repressorHillFunctionData,
  children,
  mainLineColor = CURVE.repressor,
  showKIndicator = false,
}: RepressorGraphProps) => {
  const yTicks: Tick[] = [[repressorBeta, "β"]];
  if (showKIndicator && repressorBeta > 3.5)
    yTicks.push([repressorBeta / 2, "β/2"]);

  return (
    <Plot
      title="Repressor input function"
      desc={`Promoter activity against repressor concentration X*, falling from a maximum of β with a threshold K of ${repressorK}.`}
    >
      <Axes
        scale={HILL}
        xLabel="X*"
        xTicks={showKIndicator ? [[repressorK, "K"]] : []}
        yTicks={yTicks}
      />
      <GuideLine y={repressorBeta} scale={HILL} />
      <Curve
        points={repressorHillFunctionData}
        scale={HILL}
        stroke={mainLineColor}
      />
      {children}
      {showKIndicator && (
        <Crosshair x={repressorK} y={repressorBeta / 2} scale={HILL} />
      )}
    </Plot>
  );
};

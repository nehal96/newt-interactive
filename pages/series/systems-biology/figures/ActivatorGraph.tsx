import { type ReactNode } from "react";
import {
  Axes,
  ComparisonCurve,
  Crosshair,
  CURVE,
  Curve,
  GuideLine,
  HILL,
  Plot,
  stackedLabelYs,
  type Tick,
} from "./chart";
import { getActivatorHillFunctionData, type Point } from "./helpers";

interface ActivatorGraphProps {
  activatorBeta: number;
  activatorK: number;
  activatorHillFunctionData: Point[];
  children?: ReactNode;
  showKTick?: boolean;
  showKIndicator?: boolean;
  showNComparisonCurves?: boolean;
  hideMainCurve?: boolean;
}

export const ActivatorGraph = ({
  activatorBeta,
  activatorK,
  activatorHillFunctionData,
  children,
  showKTick = false,
  showKIndicator = false,
  showNComparisonCurves = false,
  hideMainCurve = false,
}: ActivatorGraphProps) => {
  const comparisonNs = [2, 4];
  const comparisons = comparisonNs.map((n) =>
    getActivatorHillFunctionData(20, activatorK, n)
  );
  const comparisonLabelYs = stackedLabelYs(comparisons);

  const yTicks: Tick[] = [[activatorBeta, "β"]];
  // Below this the β/2 tick collides with the β tick, and the two labels
  // become one smudge.
  if (showKIndicator && activatorBeta > 3.5)
    yTicks.push([activatorBeta / 2, "β/2"]);

  return (
    <Plot
      title="Activator input function"
      desc={`Promoter activity against activator concentration X*, rising towards a maximum of β with a threshold K of ${activatorK}.`}
    >
      <Axes
        scale={HILL}
        xLabel="X*"
        xTicks={showKTick || showKIndicator ? [[activatorK, "K"]] : []}
        yTicks={yTicks}
      />
      <GuideLine y={activatorBeta} scale={HILL} />
      {showNComparisonCurves &&
        comparisons.map((points, i) => (
          <ComparisonCurve
            key={comparisonNs[i]}
            points={points}
            label={`n = ${comparisonNs[i]}`}
            labelY={comparisonLabelYs[i]}
            drawIn
          />
        ))}
      {!hideMainCurve && (
        <Curve
          points={activatorHillFunctionData}
          scale={HILL}
          stroke={CURVE.activator}
        />
      )}
      {children}
      {showKIndicator && (
        <Crosshair x={activatorK} y={activatorBeta / 2} scale={HILL} />
      )}
    </Plot>
  );
};

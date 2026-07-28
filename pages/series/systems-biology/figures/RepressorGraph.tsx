import {
  VictoryChart,
  VictoryAxis,
  VictoryLine,
  VictoryLabel,
  VictoryContainer,
} from "victory";
import { axisStyle, getGridLineStyle } from "@viz/chart";
import { crosshairAt, noTicksAxisStyle } from "./chart";
import { Point } from "./helpers";

interface RepressorGraphProps {
  repressorBeta: number;
  repressorK: number;
  repressorHillFunctionData: Point[];
  children?: React.ReactNode;
  mainLineColor?: string;
  showKIndicator?: boolean;
}

export const RepressorGraph = ({
  repressorBeta,
  repressorK,
  repressorHillFunctionData,
  children,
  mainLineColor = "#3b82f6",
  showKIndicator = false,
}: RepressorGraphProps) => {
  const gridLineStyle = getGridLineStyle();

  const XAxisStyle = showKIndicator ? axisStyle : noTicksAxisStyle;
  const XAxisTickValues = showKIndicator ? [repressorK] : [];
  const XAxisTickFormat = showKIndicator ? () => "K" : () => "";
  const YAxisTickValues = showKIndicator
    ? [repressorBeta / 2, repressorBeta]
    : [repressorBeta];

  return (
    <VictoryChart
      domain={{ x: [0, 20], y: [0, 22] }}
      containerComponent={<VictoryContainer responsive={true} />}
    >
      <VictoryAxis
        label="X*"
        style={XAxisStyle}
        tickValues={XAxisTickValues}
        tickFormat={XAxisTickFormat}
        axisLabelComponent={<VictoryLabel dy={-37} dx={190} />}
      />
      <VictoryAxis
        dependentAxis
        style={axisStyle}
        tickValues={YAxisTickValues}
        tickFormat={(t) =>
          t == repressorBeta ? "β" : repressorBeta > 3.5 ? "β/2" : ""
        }
      />
      <VictoryLine
        style={gridLineStyle}
        data={[
          { x: 0.05, y: repressorBeta },
          { x: 20, y: repressorBeta },
        ]}
      />
      <VictoryLine
        style={{
          data: { stroke: mainLineColor },
          parent: { border: "1px solid #ccc" },
        }}
        data={repressorHillFunctionData}
        interpolation="basis"
      />
      {children}
      {showKIndicator && crosshairAt(repressorK, repressorBeta / 2)}
    </VictoryChart>
  );
};

import {
  VictoryAxis,
  VictoryLine,
  VictoryContainer,
  VictoryLabel,
} from "victory";
import { VictoryChart } from "victory";
import { axisStyle, getDottedLineStyle, SlideDeck } from "../../components";

const FACTOR = 8;

const getData = (t_steady: number, domainMin = 0, domainMax = 20) => {
  const data = [];

  for (let t = domainMin; t <= t_steady; t += 0.1) {
    data.push({ x: t, y: t * FACTOR });
  }

  const steady_state = t_steady * FACTOR;
  for (let t = t_steady; t <= domainMax; t += 0.1) {
    data.push({ x: t, y: steady_state });
  }

  return data;
};

export const NegativeAutoregTimeResponseChart = ({ t_steady = 5 }) => {
  const dottedLineStyle = getDottedLineStyle();
  const noTicksStyle = {
    ...axisStyle,
    ticks: { ...axisStyle.ticks, size: 0 },
  };
  const XAxisTickValues = [];

  const steadyState = t_steady * FACTOR;

  const getSolidLineData = () => getData(t_steady);

  const getDottedLineData = () => {
    const data = [];
    for (let t = t_steady; t <= 20; t += 0.1) {
      data.push({ x: t, y: t * FACTOR });
    }
    return data;
  };

  return (
    <VictoryChart
      domain={{ x: [0, 20], y: [0, 70] }}
      containerComponent={<VictoryContainer responsive={true} />}
    >
      <VictoryAxis
        label="time"
        style={noTicksStyle}
        tickValues={XAxisTickValues}
        axisLabelComponent={<VictoryLabel dy={-39} dx={195} />}
      />
      <VictoryAxis
        dependentAxis
        style={axisStyle}
        tickValues={[t_steady * FACTOR]}
        tickFormat={() => "K"}
      />
      <VictoryLine
        style={dottedLineStyle}
        data={[
          { x: 0, y: steadyState },
          { x: t_steady, y: steadyState },
        ]}
      />
      <VictoryLine
        style={{
          data: { stroke: "#2dd4bf", strokeWidth: 2 },
        }}
        data={getSolidLineData()}
      />
      <VictoryLine
        style={{
          data: {
            ...dottedLineStyle.data,
            strokeWidth: 2,
            strokeDasharray: "4,4",
            stroke: "#0d9488",
          },
        }}
        data={getDottedLineData()}
      />
    </VictoryChart>
  );
};

export const NegativeAutoregTimeResponseTutorial = ({ t_steady = 5 }) => {
  const slides = [
    {
      text: <></>,
      interactive: <NegativeAutoregTimeResponseChart t_steady={t_steady} />,
    },
  ];

  return <SlideDeck slides={slides} />;
};

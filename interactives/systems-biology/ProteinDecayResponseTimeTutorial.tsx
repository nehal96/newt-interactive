import {
  VictoryAxis,
  VictoryChart,
  VictoryContainer,
  VictoryLine,
} from "victory";
import { SlideDeck } from "../../components";
import { axisStyle } from "../../components";

const ProteinDecayResponseTimeChart = () => {
  const noTicksStyle = {
    ...axisStyle,
    ticks: { ...axisStyle.ticks, size: 0 },
  };

  const proteinDecayResponseTimeFunction = (t, alpha = 2, steadyState = 10) => {
    return steadyState * Math.exp(-alpha * t);
  };

  const getProteinDecayResponseTimeData = (
    alpha = 0.25,
    steadyState = 100,
    domainMin = 0,
    domainMax = 20
  ) => {
    const data = [];

    for (let t = domainMin; t <= domainMax; t++) {
      const y = proteinDecayResponseTimeFunction(t, alpha, steadyState);
      data.push({ x: t, y });
    }

    return data;
  };

  const data = getProteinDecayResponseTimeData();

  return (
    <VictoryChart containerComponent={<VictoryContainer responsive={true} />}>
      <VictoryAxis style={noTicksStyle} tickValues={[]} tickFormat={() => ""} />
      <VictoryAxis
        dependentAxis
        style={noTicksStyle}
        tickValues={[]}
        tickFormat={() => ""}
      />
      <VictoryLine
        style={{
          data: { stroke: "#2dd4bf" },
          parent: { border: "1px solid #ccc" },
        }}
        data={data}
        interpolation="basis"
      />
    </VictoryChart>
  );
};

export const ProteinDecayResponseTimeTutorial = () => {
  const slides = [
    {
      text: (
        <>
          <p>protein decay chart</p>
        </>
      ),
      interactive: <ProteinDecayResponseTimeChart />,
    },
  ];

  return <SlideDeck slides={slides} />;
};

export default ProteinDecayResponseTimeTutorial;

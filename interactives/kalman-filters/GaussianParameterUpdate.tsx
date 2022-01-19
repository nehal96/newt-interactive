import { VictoryChart, VictoryArea, VictoryAxis } from "victory";

const getGaussianData = (mean = 24, sigma = 8) => {
  const data = [];
  const scaleFactor = 250;

  const gaussian = (x: number) => {
    const gaussianConstant = 1 / Math.sqrt(2 * Math.PI);
    const newX = (x - mean) / sigma;
    return (gaussianConstant * Math.exp(-0.5 * newX * newX)) / sigma;
  };

  for (let x = 0; x < 80; x++) {
    const y = gaussian(x);
    data.push({ x, y: y * scaleFactor });
  }

  return data;
};

const GaussianParameterUpdate = () => {
  const gaussianOne = getGaussianData();
  const gaussianTwo = getGaussianData(48, 6);

  return (
    <div className="h-[500px] bg-slate-200">
      <VictoryChart>
        <VictoryArea
          data={gaussianOne}
          style={{
            data: {
              fill: "#a5b4fc",
              fillOpacity: 0.5,
            },
          }}
          interpolation="natural"
        />
        <VictoryArea
          data={gaussianTwo}
          style={{
            data: {
              fill: "#6ee7b7",
              fillOpacity: 0.5,
            },
          }}
          interpolation="natural"
        />
        <VictoryAxis
          style={{
            axis: { stroke: "#94a3b8" },
            tickLabels: { fontSize: 10, fill: "#334155" },
            ticks: { stroke: "#94a3b8", size: 4 },
          }}
        />
        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: "#94a3b8" },
            tickLabels: { fontSize: 10, fill: "#334155" },
            ticks: { stroke: "#94a3b8", size: 4 },
          }}
        />
      </VictoryChart>
    </div>
  );
};

export default GaussianParameterUpdate;

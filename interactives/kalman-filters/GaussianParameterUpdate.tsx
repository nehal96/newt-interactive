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
  const priorMean = 24,
    priorSigma = 10;
  const measurementMean = 48,
    measurementSigma = 6;

  const mockPriorGaussian = getGaussianData(priorMean, priorSigma);
  const mockMeasurementGaussian = getGaussianData(
    measurementMean,
    measurementSigma
  );

  const posteriorMean =
    (measurementSigma * priorMean + priorSigma * measurementMean) /
    (priorSigma + measurementSigma);
  const posteriorSigma = 1 / (1 / priorSigma + 1 / measurementSigma);
  const mockPosteriorGaussian = getGaussianData(posteriorMean, posteriorSigma);

  console.log({ posteriorMean, posteriorSigma });

  return (
    <div className="h-[500px] bg-slate-200">
      <VictoryChart>
        <VictoryArea
          data={mockPriorGaussian}
          style={{
            data: {
              fill: "#a5b4fc",
              fillOpacity: 0.5,
            },
          }}
          interpolation="natural"
        />
        <VictoryArea
          data={mockMeasurementGaussian}
          style={{
            data: {
              fill: "#6ee7b7",
              fillOpacity: 0.5,
            },
          }}
          interpolation="natural"
        />
        <VictoryArea
          data={mockPosteriorGaussian}
          style={{
            data: {
              fill: "#7dd3fc",
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
          domain={[0, 31]}
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

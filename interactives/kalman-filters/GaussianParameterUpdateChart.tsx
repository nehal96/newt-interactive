import { VictoryChart, VictoryArea, VictoryAxis } from "victory";
import { GaussianParameterUpdateChartParams } from "./types";

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

const GaussianParameterUpdateChart = ({
  showPriorGaussian,
  showMeasurementGaussian,
  showPosteriorGaussian,
}: GaussianParameterUpdateChartParams) => {
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
    <div className="h-[500px] flex justify-center items-center">
      <VictoryChart width={550} height={400}>
        {showPriorGaussian ? (
          <VictoryArea
            data={mockPriorGaussian}
            style={{
              data: {
                fill: "#a5b4fc",
                fillOpacity: 0.5,
              },
            }}
            animate={{
              onLoad: {
                duration: 1500,
              },
              onExit: {
                duration: 500,
              },
            }}
            interpolation="natural"
          />
        ) : null}
        <VictoryArea
          data={mockMeasurementGaussian}
          style={{
            data: {
              fill: "#6ee7b7",
              fillOpacity: showMeasurementGaussian ? 0.5 : 0,
              strokeOpacity: showMeasurementGaussian ? 1 : 0,
            },
          }}
          interpolation="natural"
        />
        <VictoryArea
          data={mockPosteriorGaussian}
          style={{
            data: {
              fill: "#7dd3fc",
              fillOpacity: showPosteriorGaussian ? 0.5 : 0,
              strokeOpacity: showPosteriorGaussian ? 1 : 0,
            },
          }}
          interpolation="natural"
        />
        <VictoryAxis
          style={{
            axis: { stroke: "#94a3b8" },
            tickLabels: { fontSize: 14, fill: "#334155" },
            ticks: { stroke: "#94a3b8", size: 4 },
          }}
        />
        <VictoryAxis
          dependentAxis
          domain={[0, 31]}
          tickFormat={() => ""}
          style={{
            axis: { stroke: "#94a3b8" },
          }}
        />
      </VictoryChart>
    </div>
  );
};

export default GaussianParameterUpdateChart;

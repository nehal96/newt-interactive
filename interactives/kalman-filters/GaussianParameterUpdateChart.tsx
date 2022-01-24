import { VictoryChart, VictoryArea, VictoryAxis } from "victory";
import { min, max } from "lodash";
import { GaussianParameterUpdateChartParams } from "./types";

const getGaussianData = (
  mean = 24,
  sigma = 8,
  domainMin = 0,
  domainMax = 100
) => {
  const data = [];
  const scaleFactor = 250;

  const gaussian = (x: number) => {
    const gaussianConstant = 1 / Math.sqrt(2 * Math.PI);
    const newX = (x - mean) / sigma;
    return (gaussianConstant * Math.exp(-0.5 * newX * newX)) / sigma;
  };

  for (let x = domainMin; x <= domainMax; x++) {
    const y = gaussian(x);
    data.push({ x, y: y * scaleFactor });
  }

  return data;
};

const GaussianParameterUpdateChart = ({
  height,
  gaussianParams,
  showPriorGaussian,
  showMeasurementGaussian,
  showPosteriorGaussian,
}: GaussianParameterUpdateChartParams) => {
  const {
    priorMean,
    priorSigma,
    measurementMean,
    measurementSigma,
    posteriorMean,
    posteriorSigma,
  } = gaussianParams;

  // Min is 3 deviations less than prior, Max is 3 deviations more than measurement
  const minX = priorMean - 3 * priorSigma;
  const maxX = measurementMean + 3 * measurementSigma + 10;
  const domainMin = min([minX, 0]);
  const domainMax = max([100, maxX]);

  const mockPriorGaussian = getGaussianData(
    priorMean,
    priorSigma,
    domainMin,
    domainMax
  );
  const mockMeasurementGaussian = getGaussianData(
    measurementMean,
    measurementSigma,
    domainMin,
    domainMax
  );
  const mockPosteriorGaussian = getGaussianData(
    posteriorMean,
    posteriorSigma,
    domainMin,
    domainMax
  );

  return (
    <div className={`${height} flex justify-center items-center`}>
      <VictoryChart
        width={550}
        height={400}
        domain={{ x: [domainMin, domainMax] }}
      >
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
        {showMeasurementGaussian ? (
          <VictoryArea
            data={mockMeasurementGaussian}
            style={{
              data: {
                fill: "#6ee7b7",
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
        {showPosteriorGaussian ? (
          <VictoryArea
            data={mockPosteriorGaussian}
            style={{
              data: {
                fill: "#7dd3fc",
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
        <VictoryAxis
          label="Position (m)"
          style={{
            axis: { stroke: "#94a3b8" },
            axisLabel: { padding: 30 },
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

import { Area, type Datum, niceTicks, Plot, XAxis, YAxis } from "@viz/chart";
import { GaussianParameterUpdateChartParams } from "./types";

const SAMPLES = 240;
const SCALE_FACTOR = 250;
const Y_MAX = 31;

const GAUSSIAN = {
  prior: "#a5b4fc",
  measurement: "#6ee7b7",
  posterior: "#7dd3fc",
};

const getGaussianData = (
  mean: number,
  sigma: number,
  domainMin: number,
  domainMax: number
): Datum[] => {
  const gaussian = (x: number) => {
    const gaussianConstant = 1 / Math.sqrt(2 * Math.PI);
    const newX = (x - mean) / sigma;
    return (gaussianConstant * Math.exp(-0.5 * newX * newX)) / sigma;
  };

  const step = (domainMax - domainMin) / SAMPLES;
  const data: Datum[] = [];
  for (let i = 0; i <= SAMPLES; i++) {
    const x = domainMin + i * step;
    data.push({ x, y: gaussian(x) * SCALE_FACTOR });
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
  const domainMin = Math.min(minX, 0);
  const domainMax = Math.max(100, maxX);

  const curves = [
    {
      show: showPriorGaussian,
      fill: GAUSSIAN.prior,
      data: getGaussianData(priorMean, priorSigma, domainMin, domainMax),
    },
    {
      show: showMeasurementGaussian,
      fill: GAUSSIAN.measurement,
      data: getGaussianData(
        measurementMean,
        measurementSigma,
        domainMin,
        domainMax
      ),
    },
    {
      show: showPosteriorGaussian,
      fill: GAUSSIAN.posterior,
      data: getGaussianData(
        posteriorMean,
        posteriorSigma,
        domainMin,
        domainMax
      ),
    },
  ];

  // The zero tick would print on top of the vertical axis, which stands on it.
  const xTicks = niceTicks(domainMin, domainMax).filter((t) => t !== 0);

  return (
    <div className={`${height} flex justify-center items-center`}>
      <Plot
        width={550}
        height={400}
        padding={{ top: 50, right: 50, bottom: 50, left: 50 }}
        x={[domainMin, domainMax]}
        y={[0, Y_MAX]}
        title="Prior, measurement and posterior distributions over position"
        className="h-full"
      >
        {curves.map(
          ({ show, fill, data }, i) =>
            show && (
              <Area
                key={i}
                data={data}
                fill={fill}
                opacity={0.5}
                className="animate-in fade-in duration-700"
              />
            )
        )}
        <XAxis
          ticks={xTicks.map((t) => [t, t.toString()])}
          label="Position (m)"
          fill="#334155"
          fontSize={14}
          tickSize={4}
          tickGap={8}
          labelGap={31}
        />
        <YAxis at={0} />
      </Plot>
    </div>
  );
};

export default GaussianParameterUpdateChart;

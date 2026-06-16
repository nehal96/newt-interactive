import {
  VictoryAxis,
  VictoryChart,
  VictoryContainer,
  VictoryLabel,
  VictoryLine,
  VictoryScatter,
} from "victory";
import {
  axisStyle,
  getDottedLineStyle,
  getGridLineStyle,
} from "../../../../components";

/**
 * The oxygen–hemoglobin saturation curve, modeled on the systems-biology activator
 * graph (same Victory + shared chart styles). It's the same Hill function,
 * y = β·xⁿ / (Kⁿ + xⁿ), reparameterized: β = 100% max saturation, x = pO₂ (mmHg),
 * K = P50 (half-saturation pressure), n = the Hill / cooperativity coefficient.
 * Hemoglobin is cooperative (n ≈ 2.9 → sigmoid); myoglobin is a one-seat carrier
 * (n = 1 → hyperbola). The overlays are toggled from CooperativityFigure.
 *
 * Numbers are physiological-ish and tuned so the markers land near the notebook's
 * round values (95→~98%, 60→~91%, 40→~76%, 20→~30%); easy to retune for the story.
 */

const X_MAX = 100; // pO₂, mmHg
const Y_MAX = 100; // saturation, %

const HB = { p50: 27, n: 2.9 }; // hemoglobin, resting
const HB_EXERCISE = { p50: 48, n: 2.9 }; // right-shifted (acid/CO₂/BPG/heat)
const MB = { p50: 2.8, n: 1 }; // myoglobin (one-seat, hyperbola)

const COLOR = {
  hb: "#c43a31",
  hbShift: "#ea580c",
  mb: "#6366f1",
  marker: "#1e293b",
};

const TISSUES = [
  { label: "Lungs", x: 95 },
  { label: "Resting tissue", x: 40 },
  { label: "Active muscle", x: 20 },
];

type HillParams = { p50: number; n: number };

const saturation = (x: number, { p50, n }: HillParams) =>
  (Y_MAX * x ** n) / (p50 ** n + x ** n);

function curveData(params: HillParams, step = 1) {
  const data: { x: number; y: number }[] = [];
  for (let x = 0; x <= X_MAX; x += step) data.push({ x, y: saturation(x, params) });
  return data;
}

const HB_DATA = curveData(HB);
const HB_EXERCISE_DATA = curveData(HB_EXERCISE);
const MB_DATA = curveData(MB);

type SaturationCurveChartProps = {
  showMyoglobin?: boolean;
  showP50?: boolean;
  showTissues?: boolean;
  exercising?: boolean;
};

export default function SaturationCurveChart({
  showMyoglobin,
  showP50,
  showTissues,
  exercising,
}: SaturationCurveChartProps) {
  const dotted = getDottedLineStyle();
  const grid = getGridLineStyle();

  return (
    <VictoryChart
      domain={{ x: [0, X_MAX], y: [0, Y_MAX] }}
      padding={{ top: 24, bottom: 56, left: 64, right: 28 }}
      containerComponent={<VictoryContainer responsive />}
    >
      <VictoryAxis
        label="Partial pressure of O₂ (mmHg)"
        style={axisStyle}
        tickValues={[0, 20, 40, 60, 80, 100]}
        axisLabelComponent={<VictoryLabel dy={26} />}
      />
      <VictoryAxis
        dependentAxis
        label="Saturation (%)"
        style={axisStyle}
        tickValues={[0, 25, 50, 75, 100]}
        axisLabelComponent={<VictoryLabel dy={-36} />}
      />

      {/* Myoglobin (hyperbola), drawn under the hemoglobin curve. */}
      {showMyoglobin && (
        <VictoryLine
          data={MB_DATA}
          interpolation="monotoneX"
          style={{ data: { stroke: COLOR.mb, strokeWidth: 2 } }}
        />
      )}

      {/* Hemoglobin baseline (always shown). */}
      <VictoryLine
        data={HB_DATA}
        interpolation="monotoneX"
        style={{ data: { stroke: COLOR.hb, strokeWidth: 3 } }}
      />

      {/* Right-shifted hemoglobin when the muscle is working. */}
      {exercising && (
        <VictoryLine
          data={HB_EXERCISE_DATA}
          interpolation="monotoneX"
          style={{
            data: { stroke: COLOR.hbShift, strokeWidth: 3, strokeDasharray: "6,4" },
          }}
        />
      )}

      {/* P50 marker (normal hemoglobin): drop lines + a dot at half-saturation. */}
      {showP50 && (
        <VictoryLine
          style={dotted}
          data={[
            { x: HB.p50, y: 0 },
            { x: HB.p50, y: 50 },
          ]}
        />
      )}
      {showP50 && (
        <VictoryLine
          style={dotted}
          data={[
            { x: 0, y: 50 },
            { x: HB.p50, y: 50 },
          ]}
        />
      )}
      {showP50 && (
        <VictoryScatter
          size={4}
          style={{ data: { stroke: COLOR.marker, strokeWidth: 1, fill: "white" } }}
          data={[{ x: HB.p50, y: 50 }]}
          labels={[`P₅₀ ≈ ${HB.p50}`]}
          labelComponent={
            <VictoryLabel
              dx={8}
              dy={-6}
              textAnchor="start"
              style={{ fontSize: 12, fill: COLOR.marker }}
            />
          }
        />
      )}

      {/* Tissue O₂ levels: a drop line to the resting-hemoglobin curve per tissue. */}
      {showTissues &&
        TISSUES.map((t) => (
          <VictoryLine
            key={`drop-${t.label}`}
            style={grid}
            data={[
              { x: t.x, y: 0 },
              { x: t.x, y: saturation(t.x, HB) },
            ]}
          />
        ))}
      {showTissues &&
        TISSUES.map((t) => {
          const y = saturation(t.x, HB);
          return (
            <VictoryScatter
              key={`dot-${t.label}`}
              size={4}
              style={{ data: { fill: COLOR.hb, stroke: COLOR.marker, strokeWidth: 1 } }}
              data={[{ x: t.x, y }]}
              labels={[`${t.label} · ${Math.round(y)}%`]}
              labelComponent={
                <VictoryLabel
                  dy={-10}
                  textAnchor={t.x > 75 ? "end" : "middle"}
                  style={{ fontSize: 12, fill: COLOR.marker }}
                />
              }
            />
          );
        })}
    </VictoryChart>
  );
}

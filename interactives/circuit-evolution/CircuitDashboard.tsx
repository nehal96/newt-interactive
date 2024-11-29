import { Fragment, memo, useState } from "react";
import {
  VictoryAxis,
  VictoryContainer,
  VictoryChart,
  VictoryLine,
  VictoryScatter,
} from "victory";
import { FiInfo, FiSettings, FiX } from "react-icons/fi";
import { Button, MathFormula, Slider, Popover } from "../../components";
import { SimulationType } from "./types";
import { CIRCUIT_CONFIG, fitnessChartAxisStyle } from "./config";
import { useMediaQuery } from "../../hooks";

const TruthTable = ({ truthTable, accuracy }) => (
  <table className="font-mono border border-slate-200 w-full">
    <thead>
      <tr className="border-b border-slate-200">
        <th className="px-2 border-r border-slate-200">X</th>
        <th className="px-2 border-r border-slate-200">Y</th>
        <th className="px-2 border-r border-slate-200">Z</th>
        <th className="px-2 border-r border-slate-200">W</th>
        <th className="px-2 border-r border-slate-200">Circuit</th>
        <th className="px-2">Goal</th>
      </tr>
    </thead>
    <tbody>
      {truthTable.map((row, i) => (
        <tr key={i} className="border-b border-slate-200">
          {row.inputs.map((input, j) => (
            <td key={j} className="px-2 text-center border-r border-slate-200">
              {input}
            </td>
          ))}
          <td
            className={`px-2 text-center border-r border-slate-200 ${
              row.circuitOutput !== row.goalOutput
                ? "bg-red-100"
                : "bg-green-100"
            }`}
          >
            {row.circuitOutput}
          </td>
          <td className="px-2 text-center">{row.goalOutput}</td>
        </tr>
      ))}
      <tr className="border-t border-slate-200 font-semibold">
        <td colSpan={4} className="px-2 text-right border-r border-slate-200">
          Accuracy:
        </td>
        <td colSpan={2} className="px-2 text-right">
          {accuracy.toFixed(1)}%
        </td>
      </tr>
    </tbody>
  </table>
);

const InputTable = ({ inputTableData }) => {
  const inputLabels = {
    "1": "X",
    "2": "Y",
    "3": "Z",
    "4": "W",
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-slate-200 text-sm">
        <tbody>
          <tr className="border-b border-slate-200">
            <th className="text-left px-1.5 border-r border-slate-200">
              Inputs
            </th>
            {inputTableData.inputs.map((inputArray, arrayIndex) => (
              <Fragment key={`input-array-${arrayIndex}`}>
                {inputArray.map((input, idx) => (
                  <td
                    key={`input-${arrayIndex}-${idx}`}
                    className="px-1.5 text-center border-r border-slate-200"
                  >
                    {inputLabels[input] || input}
                  </td>
                ))}
              </Fragment>
            ))}
          </tr>
          <tr className="border-b border-slate-200">
            <th className="text-left px-1 border-r border-slate-200">Gate</th>
            {inputTableData.gates.map((gate, index) => (
              <td
                key={`gate-${index}`}
                className="px-1.5 text-center border-r border-slate-200"
                colSpan={inputTableData.inputs[index].length}
              >
                {gate}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const FitnessInfoPopoverContent = memo(() => (
  <div className="text-sm font-mono max-w-[calc(100vw-2rem)]">
    <div className="break-words">
      <span className="underline">Fitness formula:</span>{" "}
      <MathFormula
        variant="small"
        tex="\text{fraction of correct outputs} - \epsilon n"
      />
    </div>
    <div className="text-xs leading-none text-slate-600 font-body break-words">
      <MathFormula variant="small" tex="\epsilon" /> is the fitness penalty per
      node, <MathFormula variant="small" tex="n" /> is total number of nodes in
      the circuit. For simplicity,{" "}
      <MathFormula variant="small" tex="\epsilon" /> is set to 0.
    </div>
  </div>
));

const FitnessGraph = ({ simulationType, chartData }) => (
  <>
    <div className="mt-4 underline">Fitness graph:</div>
    <div className="h-[200px]">
      <VictoryChart
        width={200}
        height={120}
        padding={{ top: 20, bottom: 40, left: 25, right: 10 }}
        domain={{ x: [0, 100], y: [0, 1] }}
        containerComponent={<VictoryContainer responsive={true} />}
      >
        <VictoryAxis
          label={
            simulationType === SimulationType.MUTATION
              ? "Mutations"
              : "Generations"
          }
          style={fitnessChartAxisStyle}
          tickValues={[0, 50, 100]}
          tickFormat={(t) => t.toString()}
        />
        <VictoryAxis
          dependentAxis
          style={fitnessChartAxisStyle}
          tickValues={[0, 0.5, 1]}
        />
        {chartData.length > 0 && (
          <VictoryLine
            style={{
              data: { stroke: "#3f3f46" },
            }}
            data={chartData}
            interpolation="monotoneX"
          />
        )}
        {chartData.length > 0 && (
          <VictoryScatter
            style={{
              data: { fill: "#ef4444" },
            }}
            size={2}
            data={[chartData?.[chartData.length - 1]]}
          />
        )}
      </VictoryChart>
    </div>
  </>
);

const MutationLog = ({ simulationType, logs, onHide }) => (
  <div className="mt-4">
    <div className="flex justify-between items-center underline mb-2">
      <span>Mutation log:</span>
      <Button variant="ghost" onClick={onHide} className="text-sm">
        <FiX size={16} />
      </Button>
    </div>
    <div className="bg-slate-800 text-white p-3 rounded-md font-mono text-sm h-[183px] overflow-y-auto">
      {logs.length === 0 ? (
        <div className="opacity-50">No mutations yet...</div>
      ) : (
        logs.map((log, index) => (
          <div key={index} className="mb-1">
            {`> ${
              simulationType === SimulationType.MUTATION
                ? "Mutation"
                : "Generation"
            } ${index + 1}: ${log}`}
          </div>
        ))
      )}
    </div>
  </div>
);

const CircuitOptions = ({
  simulationType,
  numVariations,
  setNumVariations,
}: {
  simulationType: SimulationType;
  numVariations: number;
  setNumVariations: (value: number) => void;
}) => {
  return (
    <Popover
      side="left"
      trigger={
        <button className="text-slate-800 hover:text-slate-900 hover:bg-slate-100 rounded-md p-1">
          <FiSettings size={16} />
        </button>
      }
      content={
        <>
          <div className="text-base font-semibold mb-3">Settings</div>
          <div className="w-64 space-y-3">
            <div>
              <div className="mb-0.5 text-sm">
                Variations per Generation (
                <MathFormula variant="small" tex="N" />)
              </div>
              <div className="flex items-center space-x-4">
                <Slider
                  disabled={simulationType === SimulationType.MUTATION}
                  value={[numVariations]}
                  onValueChange={(value) => setNumVariations(value[0])}
                  max={CIRCUIT_CONFIG.VARIATIONS_PER_GENERATION.MAX}
                  min={CIRCUIT_CONFIG.VARIATIONS_PER_GENERATION.MIN}
                  step={CIRCUIT_CONFIG.VARIATIONS_PER_GENERATION.STEP}
                  className="flex-grow"
                />
                <span className="min-w-[2rem] text-sm font-mono">
                  {numVariations}
                </span>
              </div>
            </div>
          </div>
        </>
      }
    />
  );
};

const CircuitDashboard = ({
  simulationType,
  numVariations,
  setNumVariations,
  truthTable,
  accuracy,
  inputTableData,
  chartData,
  mutationLogs,
}) => {
  const [showMutationLog, setShowMutationLog] = useState(false);
  const [showTruthTable, setShowTruthTable] = useState(false);
  const isMobile = useMediaQuery("(max-width: 767px)");

  const onToggleMutationLog = () => setShowMutationLog(!showMutationLog);

  return (
    <div className="flex flex-col w-full lg:w-2/3 lg:ml-4 mb-4 lg:my-0 font-mono border border-slate-200 rounded-md p-5">
      <div className="mb-4 relative">
        <div className="text-center flex flex-col sm:flex-row items-center justify-center mr-6">
          <span className="mr-2">Circuit goal:</span>
          <MathFormula tex="(X \enspace \text{XOR} \enspace Y) \enspace \text{AND} \enspace (Z \enspace \text{XOR} \enspace W)" />
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2">
          <CircuitOptions
            simulationType={simulationType}
            numVariations={numVariations}
            setNumVariations={setNumVariations}
          />
        </div>
      </div>
      <div className="flex flex-col">
        <InputTable inputTableData={inputTableData} />
        <div className="flex flex-row">
          <div className="flex-col mt-4 flex-grow md:mr-4">
            <div className="flex mt-4 items-center">
              <span className="underline">Fitness score:</span>
              <Popover
                side={isMobile ? "bottom" : "right"}
                trigger={
                  <button className="text-slate-800 hover:text-slate-900 hover:bg-slate-100 rounded-md p-1">
                    <FiInfo size={16} />
                  </button>
                }
                content={<FitnessInfoPopoverContent />}
                className="md:max-w-[450px] w-[calc(100vw-2rem)] md:w-auto"
              />
              {chartData.length > 0 && (
                <MathFormula
                  className="ml-2"
                  tex={`${chartData?.[chartData.length - 1]?.y.toFixed(3)} `}
                />
              )}
            </div>
            <FitnessGraph
              simulationType={simulationType}
              chartData={chartData}
            />
            {!showTruthTable && (
              <div className="sm:hidden">
                <Button
                  variant="ghost"
                  onClick={() => setShowTruthTable(true)}
                  className="mt-4 text-sm"
                >
                  Show truth table
                </Button>
              </div>
            )}
            {showTruthTable && (
              <div className="sm:hidden">
                <div className="flex justify-between items-center mb-1">
                  <span className="underline mr-2">Truth table:</span>
                  <Button
                    variant="ghost"
                    onClick={() => setShowTruthTable(false)}
                    className="text-sm"
                  >
                    <FiX size={16} />
                  </Button>
                </div>
                <TruthTable truthTable={truthTable} accuracy={accuracy} />
              </div>
            )}
            {!showMutationLog && (
              <Button
                variant="ghost"
                onClick={onToggleMutationLog}
                className="mt-4 text-sm"
              >
                Show mutation log
              </Button>
            )}
            {showMutationLog && (
              <MutationLog
                simulationType={simulationType}
                logs={mutationLogs}
                onHide={onToggleMutationLog}
              />
            )}
          </div>
          <div className="hidden sm:block sm:flex-col mt-4">
            <div className="underline">Truth table:</div>
            <TruthTable truthTable={truthTable} accuracy={accuracy} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CircuitDashboard;

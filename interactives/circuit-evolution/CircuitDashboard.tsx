import { Fragment, memo, useState } from "react";
import {
  VictoryAxis,
  VictoryContainer,
  VictoryChart,
  VictoryLine,
  VictoryScatter,
} from "victory";
import { FiInfo, FiSettings, FiX } from "react-icons/fi";
import {
  Button,
  MathFormula,
  Slider,
  Popover,
  TabsTrigger,
  TabsList,
  Tabs,
} from "../../components";
import { SimulationType, Theme } from "./types";
import { CIRCUIT_CONFIG, fitnessChartAxisStyle } from "./config";
import { useMediaQuery } from "../../hooks";
import { cn } from "../../lib/utils";

const TruthTable = ({ theme, truthTable, accuracy }) => {
  const getCircuitResultClass = (falseResult) => {
    return cn({
      "bg-evangelion-green text-evangelion-black":
        !falseResult && theme === Theme.EVANGELION,
      "bg-green-100": !falseResult && theme !== Theme.EVANGELION,
      "bg-evangelion-red text-evangelion-orange-100":
        falseResult && theme === Theme.EVANGELION,
      "bg-red-100": falseResult && theme !== Theme.EVANGELION,
    });
  };
  const getTableBorderColor = () => {
    return cn({
      "border-evangelion-orange-100": theme === Theme.EVANGELION,
      "border-slate-200": theme !== Theme.EVANGELION,
    });
  };

  return (
    <table className={cn("font-mono border w-full", getTableBorderColor())}>
      <thead>
        <tr className={`border-b ${getTableBorderColor()}`}>
          <th className={`px-2 border-r ${getTableBorderColor()}`}>X</th>
          <th className={`px-2 border-r ${getTableBorderColor()}`}>Y</th>
          <th className={`px-2 border-r ${getTableBorderColor()}`}>Z</th>
          <th className={`px-2 border-r ${getTableBorderColor()}`}>W</th>
          <th className={`px-2 border-r ${getTableBorderColor()}`}>Circuit</th>
          <th className={`px-2 ${getTableBorderColor()}`}>Goal</th>
        </tr>
      </thead>
      <tbody>
        {truthTable.map((row, i) => (
          <tr key={i} className={`border-b ${getTableBorderColor()}`}>
            {row.inputs.map((input, j) => (
              <td
                key={j}
                className={`px-2 text-center border-r ${getTableBorderColor()}`}
              >
                {input}
              </td>
            ))}
            <td
              className={`px-2 text-center border-r ${getTableBorderColor()} ${getCircuitResultClass(
                row.circuitOutput !== row.goalOutput
              )}`}
            >
              {row.circuitOutput}
            </td>
            <td className="px-2 text-center">{row.goalOutput}</td>
          </tr>
        ))}
        <tr className={`border-t ${getTableBorderColor()} font-semibold`}>
          <td
            colSpan={4}
            className={`px-2 text-right border-r ${getTableBorderColor()}`}
          >
            Accuracy:
          </td>
          <td colSpan={2} className="px-2 text-right">
            {accuracy.toFixed(1)}%
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const InputTable = ({ theme, inputTableData }) => {
  const inputLabels = {
    "1": "X",
    "2": "Y",
    "3": "Z",
    "4": "W",
  };

  const getInputTableBorderColor = () => {
    return cn({
      "border-evangelion-orange-100": theme === Theme.EVANGELION,
      "border-slate-200": theme !== Theme.EVANGELION,
    });
  };

  return (
    <div className="overflow-x-auto">
      <table
        className={cn("w-full border", getInputTableBorderColor(), {
          "text-sm": theme === Theme.DEFAULT,
          "text-lg": theme === Theme.EVANGELION,
        })}
      >
        <tbody>
          <tr className={cn("border-b", getInputTableBorderColor())}>
            <th
              className={cn(
                "text-left px-1.5 border-r",
                getInputTableBorderColor()
              )}
            >
              Inputs
            </th>
            {inputTableData.inputs.map((inputArray, arrayIndex) => (
              <Fragment key={`input-array-${arrayIndex}`}>
                {inputArray.map((input, idx) => (
                  <td
                    key={`input-${arrayIndex}-${idx}`}
                    className={`px-1.5 text-center border-r ${getInputTableBorderColor()}`}
                  >
                    {inputLabels[input] || input}
                  </td>
                ))}
              </Fragment>
            ))}
          </tr>
          <tr className={cn("border-b", getInputTableBorderColor())}>
            <th
              className={cn(
                "text-left px-1 border-r",
                getInputTableBorderColor(),
                theme === Theme.EVANGELION && "text-lg"
              )}
            >
              Gate
            </th>
            {inputTableData.gates.map((gate, index) => (
              <td
                key={`gate-${index}`}
                className={`px-1.5 text-center border-r ${getInputTableBorderColor()}`}
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

const FitnessGraph = ({ theme, simulationType, chartData }) => (
  <>
    <div
      className={cn("mt-4 underline", {
        "text-xl": theme === Theme.EVANGELION,
        "text-slate-900": theme !== Theme.EVANGELION,
      })}
    >
      Fitness graph:
    </div>
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
          style={fitnessChartAxisStyle(theme)}
          tickValues={[0, 50, 100]}
          tickFormat={(t) => t.toString()}
        />
        <VictoryAxis
          dependentAxis
          style={fitnessChartAxisStyle(theme)}
          tickValues={[0, 0.5, 1]}
        />
        {chartData.length > 0 && (
          <VictoryLine
            style={{
              data: {
                stroke: theme === Theme.EVANGELION ? "#55eeaa" : "#3f3f46",
              },
            }}
            data={chartData}
            interpolation="monotoneX"
          />
        )}
        {chartData.length > 0 && (
          <VictoryScatter
            style={{
              data: {
                fill: theme === Theme.EVANGELION ? "#E65B08" : "#ef4444",
              },
            }}
            size={2}
            data={[chartData?.[chartData.length - 1]]}
          />
        )}
      </VictoryChart>
    </div>
  </>
);

const MutationLog = ({ theme, simulationType, logs, onHide }) => (
  <div className="mt-4">
    <div
      className={cn("flex justify-between items-center underline mb-2", {
        "text-xl": theme === Theme.EVANGELION,
        "text-slate-900": theme !== Theme.EVANGELION,
      })}
    >
      <span>Mutation log:</span>
      <Button
        variant="ghost"
        onClick={onHide}
        className={cn("text-sm", {
          "text-evangelion-orange-100 hover:bg-evangelion-orange-100 hover:text-evangelion-black":
            theme === Theme.EVANGELION,
          "text-slate-800": theme !== Theme.EVANGELION,
        })}
      >
        <FiX size={16} />
      </Button>
    </div>
    <div
      className={cn(
        "p-3 rounded-md font-mono text-sm h-[183px] overflow-y-auto",
        {
          "bg-evangelion-black border-2 border-evangelion-orange-500 text-evangelion-green":
            theme === Theme.EVANGELION,
          "bg-slate-800 text-white": theme !== Theme.EVANGELION,
        }
      )}
    >
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
  theme,
  toggleTheme,
}: {
  simulationType: SimulationType;
  numVariations: number;
  setNumVariations: (value: number) => void;
  theme: string;
  toggleTheme: () => void;
}) => {
  return (
    <Popover
      side="left"
      className={cn({
        "bg-evangelion-black border-2 border-evangelion-orange-500 text-evangelion-orange-500":
          theme === Theme.EVANGELION,
        "border-slate-200": theme !== Theme.EVANGELION,
      })}
      trigger={
        <button
          className={cn("rounded-md p-1", {
            "text-evangelion-orange-500 hover:text-evangelion-black hover:bg-evangelion-orange-500":
              theme === Theme.EVANGELION,
            "text-slate-800 hover:text-slate-900 hover:bg-slate-100":
              theme !== Theme.EVANGELION,
          })}
        >
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
                  trackClassName={cn({
                    "bg-evangelion-orange-50": theme === Theme.EVANGELION,
                  })}
                  rangeClassName={cn({
                    "bg-evangelion-orange-500": theme === Theme.EVANGELION,
                  })}
                  thumbClassName={cn({
                    "border-evangelion-black": theme === Theme.EVANGELION,
                  })}
                />
                <span className="min-w-[2rem] text-sm font-mono">
                  {numVariations}
                </span>
              </div>
            </div>
            <div>
              <div className="mb-0.5 text-sm">Theme</div>
              <Tabs
                defaultValue="default"
                value={theme}
                onValueChange={toggleTheme}
              >
                <TabsList
                  className={cn({
                    "bg-slate-200": theme !== Theme.EVANGELION,
                    "bg-evangelion-orange-100 text-evangelion-black":
                      theme === Theme.EVANGELION,
                  })}
                >
                  <TabsTrigger
                    className={cn({
                      "text-slate-900": theme !== Theme.EVANGELION,
                      "hover:bg-evangelion-orange-200 hover:text-evangelion-black data-[state=active]:bg-evangelion-orange-500 data-[state=active]:text-evangelion-black":
                        theme === Theme.EVANGELION,
                    })}
                    value="default"
                  >
                    Default
                  </TabsTrigger>
                  <TabsTrigger
                    className={cn({
                      "text-slate-900": theme !== Theme.EVANGELION,
                      "text-evangelion-orange-500 data-[state=active]:bg-evangelion-orange-500 data-[state=active]:text-evangelion-black":
                        theme === Theme.EVANGELION,
                    })}
                    value="evangelion"
                  >
                    Evangelion
                  </TabsTrigger>
                </TabsList>
              </Tabs>
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
  theme,
  toggleTheme,
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
    <div
      className={cn(
        "flex flex-col w-full lg:w-2/3 lg:ml-4 mb-4 lg:my-0 border rounded-md p-5 transition-all duration-200 ease-in",
        {
          "bg-evangelion-black border-evangelion-black text-evangelion-orange-500 font-evangelion uppercase":
            theme === Theme.EVANGELION,
          "border-slate-200 font-mono": theme !== Theme.EVANGELION,
        }
      )}
    >
      <div className="mb-4 relative">
        <div className="text-center flex flex-col sm:flex-row items-center justify-center mr-6">
          <span
            className={cn("mr-2", {
              "text-2xl": theme === Theme.EVANGELION,
            })}
          >
            Circuit goal:
          </span>
          <MathFormula
            className={cn({
              "text-evangelion-orange-100": theme === Theme.EVANGELION,
            })}
            tex="(X \enspace \text{XOR} \enspace Y) \enspace \text{AND} \enspace (Z \enspace \text{XOR} \enspace W)"
          />
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2">
          <CircuitOptions
            simulationType={simulationType}
            numVariations={numVariations}
            setNumVariations={setNumVariations}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        </div>
      </div>
      <div className="flex flex-col">
        <InputTable theme={theme} inputTableData={inputTableData} />
        <div className="flex flex-row">
          <div className="flex-col mt-4 flex-grow md:mr-4">
            <div className="flex mt-4 items-center">
              <span
                className={cn("underline", {
                  "text-xl": theme === Theme.EVANGELION,
                  "text-slate-900": theme !== Theme.EVANGELION,
                })}
              >
                Fitness score:
              </span>
              <Popover
                side={isMobile ? "bottom" : "right"}
                trigger={
                  <button
                    className={cn("rounded-md p-1", {
                      "text-evangelion-orange-500 hover:bg-evangelion-orange-500 hover:text-evangelion-black":
                        theme === Theme.EVANGELION,
                      "text-slate-800 hover:text-slate-900 hover:bg-slate-100":
                        theme !== Theme.EVANGELION,
                    })}
                  >
                    <FiInfo size={16} />
                  </button>
                }
                content={<FitnessInfoPopoverContent />}
                className="md:max-w-[450px] w-[calc(100vw-2rem)] md:w-auto"
              />
              {chartData.length > 0 && (
                <MathFormula
                  className={cn("ml-2", {
                    "text-evangelion-orange-100": theme === Theme.EVANGELION,
                  })}
                  tex={`${chartData?.[chartData.length - 1]?.y.toFixed(3)} `}
                />
              )}
            </div>
            <FitnessGraph
              theme={theme}
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
                  <span
                    className={cn("underline", {
                      "text-evangelion-orange-100 text-xl":
                        theme === Theme.EVANGELION,
                      "text-slate-900": theme !== Theme.EVANGELION,
                    })}
                  >
                    Truth table:
                  </span>
                  <Button
                    variant="ghost"
                    onClick={() => setShowTruthTable(false)}
                    className={cn("text-sm", {
                      "text-evangelion-orange-100 hover:bg-evangelion-orange-100 hover:text-evangelion-black":
                        theme === Theme.EVANGELION,
                      "text-slate-800": theme !== Theme.EVANGELION,
                    })}
                  >
                    <FiX size={16} />
                  </Button>
                </div>
                <TruthTable
                  theme={theme}
                  truthTable={truthTable}
                  accuracy={accuracy}
                />
              </div>
            )}
            {!showMutationLog && (
              <Button
                variant="ghost"
                onClick={onToggleMutationLog}
                className={cn("mt-4 text-sm", {
                  "text-evangelion-orange-100 hover:bg-evangelion-orange-100 hover:text-evangelion-black text-base":
                    theme === Theme.EVANGELION,
                  "text-slate-800": theme !== Theme.EVANGELION,
                })}
              >
                Show mutation log
              </Button>
            )}
            {showMutationLog && (
              <MutationLog
                theme={theme}
                simulationType={simulationType}
                logs={mutationLogs}
                onHide={onToggleMutationLog}
              />
            )}
          </div>
          <div className="hidden sm:block sm:flex-col mt-4">
            <div
              className={cn("underline", {
                "text-xl": theme === Theme.EVANGELION,
                "text-slate-900": theme !== Theme.EVANGELION,
              })}
            >
              Truth table:
            </div>
            <TruthTable
              theme={theme}
              truthTable={truthTable}
              accuracy={accuracy}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CircuitDashboard;

import { useState } from "react";
import { InteractiveTutorialContainer } from "../../components";
import { useCircuitEvolution } from "./hooks";
import { CIRCUIT_CONFIG } from "./config";
import CircuitDashboard from "./CircuitDashboard";
import CircuitDisplay from "./Circuit";
import "@xyflow/react/dist/style.css";

const CircuitEvolutionSimulation = () => {
  const [numVariations, setNumVariations] = useState(
    CIRCUIT_CONFIG.VARIATIONS_PER_GENERATION.INITIAL
  );
  const [theme, setTheme] = useState("default");

  const toggleTheme = () => {
    setTheme((prevTheme) =>
      prevTheme === "default" ? "evangelion" : "default"
    );
  };

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    inputTableData,
    truthTable,
    accuracy,
    chartData,
    simulate,
    resetCircuit,
    mutationLogs,
    simulationType,
    setSimulationType,
  } = useCircuitEvolution({ numVariations });
  const [showResetWarning, setShowResetWarning] = useState(false);
  const [skipResetWarning, setSkipResetWarning] = useState(false);

  return (
    <InteractiveTutorialContainer>
      <CircuitDisplay
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        simulate={simulate}
        resetCircuit={resetCircuit}
        simulationType={simulationType}
        setSimulationType={setSimulationType}
        chartData={chartData}
        showResetWarning={showResetWarning}
        setShowResetWarning={setShowResetWarning}
        skipResetWarning={skipResetWarning}
        setSkipResetWarning={setSkipResetWarning}
      />
      <CircuitDashboard
        simulationType={simulationType}
        numVariations={numVariations}
        setNumVariations={setNumVariations}
        theme={theme}
        toggleTheme={toggleTheme}
        inputTableData={inputTableData}
        truthTable={truthTable}
        accuracy={accuracy}
        chartData={chartData}
        mutationLogs={mutationLogs}
      />
    </InteractiveTutorialContainer>
  );
};

export default CircuitEvolutionSimulation;

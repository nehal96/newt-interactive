import { initializeBeliefs } from "./helpers";
import styles from "./LocalizationSimulation.module.css";
import { SimulationGrid } from "./types";

const LocalizationSimlation2D = () => {
  const O = "orange";
  const B = "lightblue";
  const grid: SimulationGrid = [
    [O, B, B, B, O],
    [B, B, O, B, O],
    [B, O, B, B, B],
    [O, O, B, O, B],
    [O, B, O, B, O],
  ];
  const beliefs = initializeBeliefs(grid);
  console.log(beliefs);
  const [startingRowIndex, startingColIndex] = [4, 2];

  return (
    <table className={styles.grid}>
      <tbody>
        {grid.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((val, colIndex) => (
              <td
                key={`r${rowIndex + 1}c${colIndex + 1}`}
                className={styles.cell}
                style={{ backgroundColor: val }}
              >
                <svg
                  height="100%"
                  width="100%"
                  style={{ display: "block", margin: 0 }}
                >
                  <circle
                    cx="50%"
                    cy="50%"
                    r={beliefs[rowIndex][colIndex] * 36}
                    fill="darkblue"
                  />
                  {rowIndex === startingRowIndex &&
                  colIndex === startingColIndex ? (
                    <text
                      x="50%"
                      y="50%"
                      dominantBaseline="middle"
                      textAnchor="middle"
                    >
                      Q
                    </text>
                  ) : null}
                </svg>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default LocalizationSimlation2D;

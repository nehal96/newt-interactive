import styles from "./LocalizationSimulation.module.css";
import { LocalizationSimulaton2D } from "./types";

const LocalizationSimlation2D = ({
  grid,
  beliefs,
  currentPosition,
  showUnderTheHood,
}: LocalizationSimulaton2D) => {
  return (
    <>
      <table className={styles.grid}>
        <tbody>
          {grid.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((val, colIndex) => (
                <td
                  key={`r${rowIndex + 1}c${colIndex + 1}`}
                  className={`${styles.cell} ${
                    val === "orange"
                      ? "bg-orange-300"
                      : val === "lightblue"
                      ? "bg-sky-300"
                      : "bg-white"
                  } `}
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
                      fill="#1e40af"
                    />
                    {rowIndex === currentPosition.row &&
                    colIndex === currentPosition.col ? (
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
      {showUnderTheHood ? (
        <code className="border border-slate-500 rounded-md bg-slate-700 text-slate-50 mt-4 p-4 whitespace-pre-wrap overflow-auto">
          {`beliefs = ${JSON.stringify(
            beliefs.map((row) => row.map((val) => val.toPrecision(2)))
          )}\n\ncurrentPosition = ${JSON.stringify(currentPosition)}`}
        </code>
      ) : null}
    </>
  );
};

export default LocalizationSimlation2D;

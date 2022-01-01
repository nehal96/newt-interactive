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
                      <svg
                        width="37"
                        height="51"
                        viewBox="0 0 37 51"
                        fill="none"
                        x="17.5"
                        y="10.5"
                      >
                        <path
                          d="M18.1865 50.1389L0.614135 25.5L18.1865 0.861102L35.7589 25.5L18.1865 50.1389Z"
                          stroke="white"
                          strokeWidth={4}
                        />
                      </svg>
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

import styles from "./LocalizationSimulation.module.css";

const LocalizationSimlation2D = () => {
  const O = "orange";
  const B = "lightblue";
  const grid = [
    [O, B, B, B, O],
    [B, B, O, B, O],
    [B, O, B, B, B],
    [O, O, B, O, B],
    [O, B, O, B, O],
  ];
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
                {rowIndex === startingRowIndex && colIndex === startingColIndex
                  ? "Q"
                  : null}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default LocalizationSimlation2D;

import styles from "./MagicSquare.module.css";
import classnames from "classnames/bind";

const cx = classnames.bind(styles);

interface MagicSquare {
  name: string;
  n: number;
  withTotals?: Boolean;
}

const MagicSquare = ({ name, n, withTotals = false }: MagicSquare) => {
  // If with totals row + col, add 2 to square size, otherwise stick with input (n)
  const drawnSquareSize = withTotals ? n + 2 : n;
  const nArray = new Array(drawnSquareSize).fill(null);
  const lastIndex = drawnSquareSize - 1;

  // Whether the row or column is for the totals (first and last row/col)
  const getIsTotalsRow = (rowIndex) => rowIndex === 0 || rowIndex === lastIndex;
  const getIsTotalsColumn = (colIndex) =>
    colIndex === 0 || colIndex === lastIndex;

  // Styling for totals cells
  const getTotalsCellClass = (rowIndex, colIndex) => {
    if (!withTotals) return;

    const totalCellStyles = {};

    const isTotalsRow = getIsTotalsRow(rowIndex);
    const isTotalsColumn = getIsTotalsColumn(colIndex);

    // Add default totals cell styling
    if (isTotalsColumn || isTotalsRow) {
      totalCellStyles["totals--default"] = true;
    }

    // Add top-right styling
    if (rowIndex === 0 && colIndex === lastIndex) {
      totalCellStyles["totals--top-right"] = true;
    }

    // Add bottom-left styling
    if (rowIndex === lastIndex && colIndex === 0) {
      totalCellStyles["totals--bottom-left"] = true;
    }

    // Add center rows styling
    if (colIndex === lastIndex && !isTotalsRow) {
      totalCellStyles["totals--center"] = true;
    }

    // Add center columns styling
    if (rowIndex === lastIndex && !isTotalsColumn) {
      totalCellStyles["totals--bottom-center"] = true;
    }

    return totalCellStyles;
  };

  return (
    <table className={styles.grid}>
      <tbody>
        {nArray.map((elem, rowIndex) => (
          <tr key={rowIndex}>
            {nArray.map((elem, colIndex) => (
              <td
                id={`${name}-r${rowIndex + 1}c${colIndex + 1}`}
                key={colIndex}
                className={cx("cell", getTotalsCellClass(rowIndex, colIndex))}
              >
                {!getIsTotalsRow(rowIndex) && !getIsTotalsColumn(colIndex)
                  ? `${colIndex + 1}`
                  : null}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MagicSquare;

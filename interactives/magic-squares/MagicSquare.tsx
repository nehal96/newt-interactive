import { useEffect, useRef, useState } from "react";
import Animation from "./Animation";
import classnames from "classnames/bind";
// Stylinh
import styles from "./MagicSquare.module.css";
// Helpers
import {
  generateCellAnimationGroups,
  generateCellId,
} from "./magic-squares.helpers";
// Types
import { CellGrouping, Cells, MagicSquareRow } from "./types";

const cx = classnames.bind(styles);

interface MagicSquareProps {
  name: string;
  values: MagicSquareRow[];
  withTotals?: boolean;
  shouldRunAnimation?: boolean;
  shouldStopAnimation?: boolean;
  onFinishAnimation?: () => void;
}

const MagicSquare = ({
  name,
  values,
  withTotals = false,
  shouldRunAnimation = false,
  shouldStopAnimation = false,
  onFinishAnimation,
}: MagicSquareProps) => {
  const n = values.length;
  // If with totals row + col, add 2 to square size, otherwise stick with input (n)
  const drawnSquareSize = withTotals ? n + 2 : n;
  const lastIndex = drawnSquareSize - 1;

  const cellRefs = useRef<Cells>({});
  const [cellAimationGroups, setCellAnimationGroups] = useState<CellGrouping>(
    {}
  );

  // Generate cell groupings for animation and set to state to be used by animation
  // component. Only changes if the size of the matrix changes (or name, but that's
  // not a variable anyways)
  useEffect(() => {
    if (withTotals) {
      const cellAnimationGroups = generateCellAnimationGroups(
        drawnSquareSize,
        name
      );

      setCellAnimationGroups(cellAnimationGroups);
    }
  }, [drawnSquareSize, cellRefs]);

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

  // Surround the square values with 2 rows and 2 columns on null values for
  // the totals
  if (withTotals) {
    values = values.map((row) => [null, ...row, null]);
    values = [
      new Array(drawnSquareSize).fill(null),
      ...values,
      new Array(drawnSquareSize).fill(null),
    ];
  }

  return (
    <>
      <table className={styles.grid}>
        <tbody>
          {values.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((value, colIndex) => (
                <td
                  id={generateCellId(name, rowIndex + 1, colIndex + 1)}
                  ref={(el) => (el ? (cellRefs.current[el.id] = el) : null)}
                  key={colIndex}
                  className={cx("cell", getTotalsCellClass(rowIndex, colIndex))}
                >
                  {value ? value : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {withTotals ? (
        <Animation
          shouldAnimate={shouldRunAnimation}
          cells={cellRefs.current}
          animationGroups={cellAimationGroups}
          drawnSquareSize={drawnSquareSize}
          squareName={name}
          shouldStopAnimation={shouldStopAnimation}
          onFinishAnimation={onFinishAnimation}
        />
      ) : null}
    </>
  );
};

export default MagicSquare;

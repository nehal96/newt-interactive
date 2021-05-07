import { VariableInputs, Cells, CellGrouping } from "./types";

export function generate3x3MagicSquare(a: number, b: number, c: number) {
  return [
    [c - b, c + (a + b), c - a],
    [c - (a - b), c, c + (a - b)],
    [c + a, c - (a + b), c + b],
  ];
}

export function validateVariables(inputValues: VariableInputs) {
  const { a, b, c } = inputValues;

  if (a.value > 0 && Number.isInteger(a.value)) {
    a.isValid = true;
  } else {
    a.isValid = false;
  }

  // In order to validate 'b', 'a' must have a value, 'b' must have a integer
  // value, and the math condition must hold.
  if (a.value && b.value && Number.isInteger(b.value)) {
    if (b.value > a.value && b.value !== 2 * a.value) {
      b.isValid = true;
    } else {
      b.isValid = false;
    }
  } else {
    b.isValid = false;
  }

  // In order to validate 'c', both 'a' and 'b' must have a value, 'c' must be
  // an integer, and the math condition must hold.
  if (a.value && b.value && c.value) {
    if (Number.isInteger(c.value)) {
      if (c.value - a.value > b.value) {
        c.isValid = true;
      } else {
        c.isValid = false;
      }
    } else {
      c.isValid = false;
    }
  } else {
    c.isValid = false;
  }

  return inputValues;
}

// Generate a cell id from the name of the square, row number, and column number
// that's used as the id for the cell td element
export function generateCellId(name: string, rowNum: number, colNum: number) {
  return `${name}-r${rowNum}c${colNum}`;
}

// Generate cell groupings for animation: cells are grouped by [totalsCellId]: [rowIds (or colIds)]
// Moved here from Animation component because it only needs to be done once,
// and only changes if the size or name changes (so no need to re-do on each re-render)
export function generateCellAnimationGroups(
  drawnSquareSize: number,
  squareName: string
) {
  // Row/columns start at 1, end at size of drawn square
  const start = 1;
  const end = drawnSquareSize;

  // Cell groupings -- each group (row, column, right diagonal, left diagonal)
  // is grouped in an object, with the id of the totals cell being the key and
  // an array of cell ids the value
  const byRow: CellGrouping = {};
  const byCol: CellGrouping = {};
  const byRightDiagonal: CellGrouping = {};
  const byLeftDiagonal: CellGrouping = {};

  // Func. to add a cell id to one of the above groups. If there's already an
  // array, adds the cellId to it, otherwise makes one
  const addCellIdToGroup = (
    cellId: string,
    totalsId: string,
    group: CellGrouping
  ) => {
    group[totalsId] = group[totalsId] ? [...group[totalsId], cellId] : [cellId];
  };

  // Loops through each row in the square, and then each column in the square,
  // and populates the row, column, and right diagonal cell groupings initialized above
  for (let i = start + 1; i < end; i++) {
    const rowTotalsCell = generateCellId(squareName, i, end);
    const colTotalsCell = generateCellId(squareName, end, i);
    const rightDiagonalTotalsCell = generateCellId(squareName, end, end);

    for (let j = start + 1; j < end; j++) {
      const rowCellId = generateCellId(squareName, i, j);
      addCellIdToGroup(rowCellId, rowTotalsCell, byRow);

      const colCellId = generateCellId(squareName, j, i);
      addCellIdToGroup(colCellId, colTotalsCell, byCol);

      if (i === j) {
        const rightDiagonalCellId = generateCellId(squareName, i, j);
        addCellIdToGroup(
          rightDiagonalCellId,
          rightDiagonalTotalsCell,
          byRightDiagonal
        );
      }
    }
  }

  // Populates the left diagonal cell grouping
  let colNum = end - 1;
  const leftDiagonalTotalsCell = generateCellId(squareName, end, start);
  for (let i = start + 1; i < end; i++) {
    const leftDiagonalCellId = generateCellId(squareName, i, colNum);
    addCellIdToGroup(
      leftDiagonalCellId,
      leftDiagonalTotalsCell,
      byLeftDiagonal
    );

    colNum--;
  }

  // Combine all animations into one object (could maybe begin with just one,
  // but would make populating more verbose).
  const allAnimations = {
    ...byRow,
    ...byCol,
    ...byRightDiagonal,
    ...byLeftDiagonal,
  };

  return allAnimations;
}

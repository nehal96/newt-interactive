import { VariableInputs, Cells, CellIds, CellGrouping } from "./types";

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

export function runAnimation(
  cells: Cells,
  drawnSquareSize: number,
  name: string
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
    const rowTotalsCell = generateCellId(name, i, end);
    const colTotalsCell = generateCellId(name, end, i);
    const rightDiagonalTotalsCell = generateCellId(name, end, end);

    for (let j = start + 1; j < end; j++) {
      const rowCellId = generateCellId(name, i, j);
      addCellIdToGroup(rowCellId, rowTotalsCell, byRow);

      const colCellId = generateCellId(name, j, i);
      addCellIdToGroup(colCellId, colTotalsCell, byCol);

      if (i === j) {
        const rightDiagonalCellId = generateCellId(name, i, j);
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
  const leftDiagonalTotalsCell = generateCellId(name, end, start);
  for (let i = start + 1; i < end; i++) {
    const leftDiagonalCellId = generateCellId(name, i, colNum);
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

  // Timeout delay
  const delay = 250;
  // const timers = [];

  // Counter for each animation step (which is each cell)
  let stepCounter = 1;

  // Counter for animation group step (which is rows and columns and diagonals)
  let animationStep = 0;

  // Helper to imperatively change background color property of cell
  const changeCellBackgroundColor = (cellId, color) => {
    cells[cellId].style.backgroundColor = color;
  };
  // Helper to change innerHTML value of a cell
  const changeCellValue = (cellId, value) => {
    cells[cellId].innerHTML = value;
  };

  // Animating by each group (or animation step)
  const animateCellGroup = (cellGroup, totalsCellId, isLastAnimation) => {
    // const timers = [];

    for (let i = 0; i <= cellGroup.length; i++) {
      const timerId = setTimeout(() => {
        const isOnTotalsCell = i === cellGroup.length;

        if (isOnTotalsCell) {
          changeCellBackgroundColor(totalsCellId, "lightgreen");

          // Change square row/col/diagonal cells back to white
          cellGroup.forEach((cellId) => {
            changeCellBackgroundColor(cellId, "white");
          });

          // For the last animation (left diagonal), also change the top-right
          // totals cell so it looks more even
          if (isLastAnimation) {
            const topRightCellId = generateCellId(name, start, end);
            const lastTotalsCellValue = cells[totalsCellId].innerHTML;

            changeCellBackgroundColor(topRightCellId, "lightgreen");
            changeCellValue(topRightCellId, lastTotalsCellValue);
          }
        } else {
          const currentTotalsValue = cells[totalsCellId].innerHTML
            ? Number(cells[totalsCellId].innerHTML)
            : 0;
          const currentCellValue = Number(cells[cellGroup[i]].innerHTML);

          changeCellBackgroundColor(cellGroup[i], "orange");

          // Change value (add to or initialize) of totals cell for that row/col/diagonal
          changeCellValue(
            totalsCellId,
            currentTotalsValue
              ? currentTotalsValue + currentCellValue
              : currentCellValue
          );
        }
      }, delay * stepCounter);

      // timers.push(timerId);
      stepCounter++;
    }

    animationStep++;

    // Recursively call animate function
    animate(animationStep);

    // return timers;
  };

  const allTotalsCellsIds = Object.keys(allAnimations);

  const animate = (animationStep: number) => {
    const isLastAnimation = animationStep === allTotalsCellsIds.length - 1;

    // Each totals cell Id is one step/group, so call the group animating func.
    // as long as there are groups left to be animated
    if (animationStep < allTotalsCellsIds.length) {
      const timers = animateCellGroup(
        allAnimations[allTotalsCellsIds[animationStep]],
        allTotalsCellsIds[animationStep],
        isLastAnimation
      );

      // console.log(timers);
    }
  };

  // Start animation
  animate(animationStep);
}

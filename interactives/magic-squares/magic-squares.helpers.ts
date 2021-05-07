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

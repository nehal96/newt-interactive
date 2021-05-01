import { VariableInputs } from "./types";

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
    console.log("a is valid");
    a.isValid = true;
  } else {
    console.log("a is not valid");
    a.isValid = false;
  }

  // In order to validate 'b', 'a' must have a value, 'b' must have a integer
  // value, and the math condition must hold.
  if (a.value && b.value && Number.isInteger(b.value)) {
    if (b.value > a.value && b.value !== 2 * a.value) {
      console.log("b is valid");
      b.isValid = true;
    } else {
      console.log("b is not valid");
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
        console.log("c is valid");
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

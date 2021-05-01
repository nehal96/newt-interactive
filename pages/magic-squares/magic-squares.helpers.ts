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

  if (a.value > 0 && a.hasBeenFocused && Number.isInteger(a.value)) {
    console.log("a is valid");
    a.isValid = true;
  } else {
    console.log("a is not valid");
    a.isValid = false;
  }

  console.log(inputValues);

  return inputValues;
}

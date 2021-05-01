export type VariableInput = {
  value: number;
  hasBeenFocused: boolean;
  isValid: boolean | null;
};
export type VariableInputs = {
  a: VariableInput;
  b: VariableInput;
  c: VariableInput;
};

export type MagicSquareRow = number[];

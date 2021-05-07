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

export type Cells = {
  [totalsCellId: string]: HTMLTableCellElement;
};
export type CellIds = string[];
export type CellGrouping = {
  [totalsCellId: string]: CellIds;
};

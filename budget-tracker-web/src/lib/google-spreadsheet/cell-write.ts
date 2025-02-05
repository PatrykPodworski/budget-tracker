export type CellWrite = CellInfo & CellValues;

export type CellValues = {
  formula: string;
  comment?: string;
};

export type CellInfo = {
  column: number;
  row: number;
};

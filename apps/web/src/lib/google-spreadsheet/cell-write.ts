export type CellWrite = CellInfo & CellValues;

export type CellValues = {
  formula: string;
  note?: string;
};

export type CellInfo = {
  column: number;
  row: number;
};

export type CellValidation = CellInfo & {
  type: "noteId";
  value: string;
};

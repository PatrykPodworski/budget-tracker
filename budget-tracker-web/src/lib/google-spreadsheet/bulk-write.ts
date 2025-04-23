"use server";

import {
  GoogleSpreadsheet,
  GoogleSpreadsheetCell,
  GoogleSpreadsheetWorksheet,
} from "google-spreadsheet";
import { env } from "@/env";
import { getAuth } from "./get-auth";
import { CellWrite, CellInfo, CellValidation } from "./cell-write";

export const bulkWrite = async (
  sheetTitle: string,
  writes: CellWrite[],
  validation?: CellValidation
) => {
  const document = await getAndPrepareDocument();
  const sheet = await getAndPrepareSheet(document, sheetTitle, writes);

  if (!validate(sheet, validation)) {
    console.log("Validation failed, skipping write.");
    return;
  }

  writes.forEach((x) => writeToCell(sheet, x));

  await sheet.saveUpdatedCells();
};

// TODO: P0: Reuse logic in write and read
const getAndPrepareDocument = async () => {
  const auth = await getAuth();
  const document = new GoogleSpreadsheet(env.GOOGLE_DOCUMENT_ID, auth);
  await document.loadInfo();

  return document;
};

const getAndPrepareSheet = async (
  document: GoogleSpreadsheet,
  sheetTitle: string,
  writes: CellWrite[]
) => {
  const sheet = document.sheetsByTitle[sheetTitle];
  const range = getCellRange(writes);
  await sheet.loadCells(range);

  return sheet;
};

const getCellRange = (cellInfos: CellInfo[]) => {
  const columns = cellInfos.map((cellInfo) => cellInfo.column);
  const rows = cellInfos.map((cellInfo) => cellInfo.row);

  const startColumn = Math.min(...columns);
  const endColumn = Math.max(...columns);
  const startRow = Math.min(...rows);
  const endRow = Math.max(...rows);

  return {
    startColumnIndex: startColumn,
    endColumnIndex: endColumn + 1,
    startRowIndex: startRow,
    endRowIndex: endRow + 1,
  };
};

const validate = (
  sheet: GoogleSpreadsheetWorksheet,
  validation?: CellValidation
) => {
  if (!validation) {
    return true;
  }
  const { type, value } = validation;
  const { column, row } = validation;

  const cell = sheet.getCell(row, column);
  const isValid = isCellValid(cell, type, value);

  return isValid;
};

const isCellValid = (
  cell: GoogleSpreadsheetCell,
  type: CellValidation["type"],
  value: CellValidation["value"]
) => {
  switch (type) {
    case "noteId":
      console.log(
        "Validating noteId",
        cell.note,
        value,
        cell.note?.includes(value)
      );
      return cell.note ? !cell.note.includes(value) : true;
    default:
      return type satisfies never;
  }
};

const writeToCell = (
  sheet: GoogleSpreadsheetWorksheet,
  { column, row, formula, note }: CellWrite
) => {
  const cell = sheet.getCell(row, column);

  const cellContent = cell.formula || mapValueToFormula(cell.value);

  // Append if there is already value or note
  cell.formula = cellContent ? `${cellContent}+${formula}` : `=${formula}`;
  cell.note = cell.note ? `${cell.note}\n${note}` : note;
};

const mapValueToFormula = (value: GoogleSpreadsheetCell["value"]) => {
  if (!value) {
    return undefined;
  }

  if (typeof value === "number") {
    return `=${value}`;
  }

  throw new Error(`Unsupported value type: ${typeof value}`);
};

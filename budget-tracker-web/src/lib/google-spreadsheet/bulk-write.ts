"use server";

import { env } from "@/env";
import {
  GoogleSpreadsheet,
  GoogleSpreadsheetCell,
  GoogleSpreadsheetWorksheet,
} from "google-spreadsheet";
import { getAuth } from "./get-auth";
import { CellWrite, CellInfo } from "./cell-write";

export const bulkWrite = async (sheetTitle: string, writes: CellWrite[]) => {
  const document = await getAndPrepareDocument();
  const sheet = await getAndPrepareSheet(document, sheetTitle, writes);

  writes.forEach((x) => writeToCell(sheet, x));

  await sheet.saveUpdatedCells();
};

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

// TODO: P0 Check if there is a value if formula is missing
const writeToCell = (
  sheet: GoogleSpreadsheetWorksheet,
  { column, row, formula, comment }: CellWrite
) => {
  const cell = sheet.getCell(row, column);

  const cellContent = cell.formula || mapValueToFormula(cell.value);

  // Append if there is already value or note
  cell.formula = cellContent ? `${cellContent}+${formula}` : `=${formula}`;
  cell.note = cell.note ? `${cell.note}\n${comment}` : comment;
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

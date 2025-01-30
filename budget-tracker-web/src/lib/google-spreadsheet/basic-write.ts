"use server";

import { env } from "@/env";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { getAuth } from "./get-auth";
import { categories } from "@/data/categories";
import { getColumnToWrite, getRowToWrite, getSheetTitleToWrite } from "./utils";

export const bulkWrite = async (sheetTitle: string, writes: CellWrite[]) => {
  const auth = await getAuth();
  const document = new GoogleSpreadsheet(env.GOOGLE_DOCUMENT_ID, auth);
  await document.loadInfo();
  const sheet = document.sheetsByTitle[sheetTitle];

  const range = getCellRange(writes);
  await sheet.loadCells(range);

  writes.forEach(({ column, row, formula }) => {
    const cell = sheet.getCell(row, column);
    cell.value = cell.formula ? `${cell.formula}+${formula}` : `=${formula}`;
  });

  await sheet.saveUpdatedCells();
};

export type CellWrite = CellInfo & {
  formula: string;
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

type CellInfo = {
  column: number;
  row: number;
};

export const basicWrite = async ({
  transactionDate,
  formula,
  category,
}: BasicWriteParams) => {
  const auth = await getAuth();
  const document = new GoogleSpreadsheet(env.GOOGLE_DOCUMENT_ID, auth);

  await document.loadInfo();

  const sheetTitle = getSheetTitleToWrite(transactionDate);
  const sheet = document.sheetsByTitle[sheetTitle];

  const column = getColumnToWrite(transactionDate);
  const row = getRowToWrite(category);
  await sheet.loadCells({
    startColumnIndex: column,
    endColumnIndex: column + 1,
    startRowIndex: row,
    endRowIndex: row + 1,
  });
  const cell = sheet.getCell(row, column);

  cell.value = cell.formula ? `${cell.formula}+${formula}` : `=${formula}`;

  await sheet.saveUpdatedCells();
};

type BasicWriteParams = {
  transactionDate: Date;
  formula: string;
  category: (typeof categories)[number] | undefined;
};

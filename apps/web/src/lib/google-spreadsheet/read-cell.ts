"use server";

import { env } from "@/env";
import {
  GoogleSpreadsheet,
  GoogleSpreadsheetCell,
  GoogleSpreadsheetWorksheet,
} from "google-spreadsheet";
import { getAuth } from "./get-auth";
import { CellInfo } from "./cell-write";

/**
 * Reads a single cell from the Google Spreadsheet
 * @param sheetTitle The title of the sheet to read from
 * @param cellInfo The cell coordinates (row and column)
 * @returns The GoogleSpreadsheetCell object or null if an error occurred
 */
export const readCell = async (
  sheetTitle: string,
  cellInfo: CellInfo
): Promise<GoogleSpreadsheetCell | null> => {
  try {
    const document = await getAndPrepareDocument();
    const sheet = await getAndPrepareSheet(document, sheetTitle, cellInfo);

    const { row, column } = cellInfo;
    const cell = sheet.getCell(row, column);

    return cell;
  } catch (error) {
    console.error("Error reading cell:", error);
    return null;
  }
};

/**
 * Gets and prepares the Google Spreadsheet document for reading
 */
const getAndPrepareDocument = async (): Promise<GoogleSpreadsheet> => {
  const auth = await getAuth();
  const document = new GoogleSpreadsheet(env.GOOGLE_DOCUMENT_ID, auth);
  await document.loadInfo();

  return document;
};

/**
 * Gets and prepares a specific sheet for reading a cell
 */
const getAndPrepareSheet = async (
  document: GoogleSpreadsheet,
  sheetTitle: string,
  cellInfo: CellInfo
): Promise<GoogleSpreadsheetWorksheet> => {
  const sheet = document.sheetsByTitle[sheetTitle];
  if (!sheet) {
    throw new Error(`Sheet with title "${sheetTitle}" not found`);
  }

  const range = getSingleCellRange(cellInfo);
  await sheet.loadCells(range);

  return sheet;
};

/**
 * Gets the cell range for loading a single cell
 */
const getSingleCellRange = (cellInfo: CellInfo) => {
  const { column, row } = cellInfo;

  return {
    startColumnIndex: column,
    endColumnIndex: column + 1,
    startRowIndex: row,
    endRowIndex: row + 1,
  };
};
